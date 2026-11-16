import {
  RELEASE_PROJECTS,
  RELEASE_SCHEMA,
} from "@shared/consts/releases.consts.ts";
import { ReleaseProject } from "@shared/types/releases.types.ts";

export const getReleaseFileFromBytes = (
  bytes: Uint8Array,
): Map<ReleaseProject, string> | null => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.byteLength < 4) return null;
  if (bytes[0] !== 0x4f || bytes[1] !== 0x48) return null; // "OH"

  const schema = view.getUint8(2);
  if (schema !== RELEASE_SCHEMA) return null;

  const count = view.getUint8(3);
  if (bytes.byteLength < 4 + count * 7) return null;

  const versions = new Map<ReleaseProject, string>();
  let offset = 4;
  for (let i = 0; i < count; i++) {
    const id = view.getUint8(offset);
    const major = view.getUint16(offset + 1); // big-endian by default
    const minor = view.getUint16(offset + 3);
    const patch = view.getUint16(offset + 5);
    offset += 7;

    const project = RELEASE_PROJECTS[id];
    if (project) versions.set(project, `${major}.${minor}.${patch}`);
  }
  return versions;
};
