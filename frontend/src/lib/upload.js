import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

export const MAX_IMAGE_MB = 5;

export function validateImage(file) {
  if (!file.type.startsWith("image/")) return "IMAGE_INVALID_TYPE";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return "IMAGE_TOO_LARGE";
  return null;
}

export function uploadImage(file, folder, onProgress) {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const storageRef = ref(getStorage(app), `${folder}/${Date.now()}-${safeName}`);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      () => getDownloadURL(task.snapshot.ref).then(resolve, reject)
    );
  });
}
