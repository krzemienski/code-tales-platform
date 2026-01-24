import { NextRequest, NextResponse } from "next/server";
import { getFileStream, getFileMetadata } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const bucketPrefix = `/replit-objstore-${process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID}`;
  if (path.startsWith(bucketPrefix)) {
    path = path.slice(bucketPrefix.length);
  }
  
  if (path.startsWith("/replit-objstore-")) {
    const match = path.match(/^\/replit-objstore-[^/]+(.*)$/);
    if (match) {
      path = match[1];
    }
  }
  
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  try {
    console.log("[Audio API] Looking for path:", path);
    const metadata = await getFileMetadata(path);
    console.log("[Audio API] Metadata result:", metadata);
    if (!metadata) {
      return NextResponse.json({ error: "File not found", path }, { status: 404 });
    }

    const fileSize = metadata.size;
    const rangeHeader = request.headers.get("range");

    const stream = await getFileStream(path);
    if (!stream) {
      return NextResponse.json({ error: "Failed to get file stream" }, { status: 500 });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    if (rangeHeader) {
      const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const requestedEnd = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;
        const end = Math.min(requestedEnd, fileSize - 1);
        const contentLength = end - start + 1;

        if (start >= fileSize) {
          return new NextResponse(null, {
            status: 416,
            headers: {
              "Content-Range": `bytes */${fileSize}`,
            },
          });
        }

        const partialBuffer = buffer.subarray(start, end + 1);

        return new NextResponse(partialBuffer, {
          status: 206,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": contentLength.toString(),
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      }
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Audio serving error:", error);
    return NextResponse.json({ error: "Failed to serve audio" }, { status: 500 });
  }
}
