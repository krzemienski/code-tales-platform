import { Storage } from "@google-cloud/storage";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

function getBucketId(): string {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) {
    throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");
  }
  return bucketId;
}

function getPrivateObjectDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR;
  if (!dir) {
    throw new Error("PRIVATE_OBJECT_DIR not set");
  }
  return dir;
}

function stripBucketPrefix(path: string): string {
  const match = path.match(/\/replit-objstore-[a-f0-9-]+\/(.+)/);
  return match ? match[1] : path;
}

export async function uploadAudioFile(
  audioData: ArrayBuffer | Buffer,
  fileName: string,
  contentType: string = "audio/mpeg"
): Promise<string> {
  const bucketId = getBucketId();
  const privateDir = getPrivateObjectDir();
  
  const objectPath = `${privateDir}/audio/${fileName}`;
  const bucket = storageClient.bucket(bucketId);
  const file = bucket.file(objectPath);

  const buffer = Buffer.isBuffer(audioData) ? audioData : Buffer.from(audioData);

  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  return stripBucketPrefix(objectPath);
}

export async function uploadAudioChunk(
  audioData: ArrayBuffer | Buffer,
  storyId: string,
  chunkIndex: number,
  contentType: string = "audio/mpeg"
): Promise<string> {
  const bucketId = getBucketId();
  const privateDir = getPrivateObjectDir();
  
  const objectPath = `${privateDir}/audio/${storyId}/chunk_${String(chunkIndex).padStart(3, "0")}.mp3`;
  const bucket = storageClient.bucket(bucketId);
  const file = bucket.file(objectPath);

  const buffer = Buffer.isBuffer(audioData) ? audioData : Buffer.from(audioData);

  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  return stripBucketPrefix(objectPath);
}

export async function uploadCombinedAudio(
  audioData: ArrayBuffer | Buffer,
  storyId: string,
  contentType: string = "audio/mpeg"
): Promise<string> {
  const bucketId = getBucketId();
  const privateDir = getPrivateObjectDir();
  
  const objectPath = `${privateDir}/audio/${storyId}/complete.mp3`;
  const bucket = storageClient.bucket(bucketId);
  const file = bucket.file(objectPath);

  const buffer = Buffer.isBuffer(audioData) ? audioData : Buffer.from(audioData);

  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  return stripBucketPrefix(objectPath);
}

export async function getFileMetadata(objectPath: string): Promise<{ size: number } | null> {
  try {
    const bucketId = getBucketId();
    const privateDir = getPrivateObjectDir();
    const bucket = storageClient.bucket(bucketId);
    
    let fullPath = objectPath;
    if (objectPath.startsWith(".private/")) {
      fullPath = `${privateDir}/${objectPath.slice(9)}`;
    }
    
    const file = bucket.file(fullPath);
    
    const [metadata] = await file.getMetadata();
    return { size: parseInt(metadata.size as string, 10) || 0 };
  } catch {
    return null;
  }
}

export async function getFileStream(objectPath: string): Promise<NodeJS.ReadableStream | null> {
  try {
    const bucketId = getBucketId();
    const privateDir = getPrivateObjectDir();
    const bucket = storageClient.bucket(bucketId);
    
    let fullPath = objectPath;
    if (objectPath.startsWith(".private/")) {
      fullPath = `${privateDir}/${objectPath.slice(9)}`;
    }
    
    const file = bucket.file(fullPath);
    
    const [exists] = await file.exists();
    if (!exists) {
      return null;
    }
    
    return file.createReadStream();
  } catch {
    return null;
  }
}

export async function deleteAudioFile(objectPath: string): Promise<void> {
  const bucketId = getBucketId();
  const bucket = storageClient.bucket(bucketId);
  const file = bucket.file(objectPath);
  
  const [exists] = await file.exists();
  if (exists) {
    await file.delete();
  }
}
