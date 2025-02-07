import {
  ReadableStream,
  WritableStream,
  TransformStream,
} from "web-streams-polyfill";
import { Platform } from "react-native";
import structuredClone from "@ungap/structured-clone";

import type {
  ReadableStream as ReadableStreamType,
  WritableStream as WritableStreamType,
  TransformStream as TransformStreamType,
} from "web-streams-polyfill/types/polyfill";

// Apply stream polyfills
if (Platform.OS !== "web") {
  try {
    const g = global as any;

    if (!("ReadableStream" in g)) {
      g.ReadableStream = ReadableStream as typeof ReadableStreamType;
    }
    if (!("WritableStream" in g)) {
      g.WritableStream = WritableStream as typeof WritableStreamType;
    }
    if (!("TransformStream" in g)) {
      g.TransformStream = TransformStream as typeof TransformStreamType;
    }

    if (!global.structuredClone) {
      (global as any).structuredClone = structuredClone;
    }
  } catch (error) {
    console.warn("Error applying web streams polyfill:", error);
  }
}
