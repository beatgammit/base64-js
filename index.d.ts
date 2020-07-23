declare namespace base64_js {
    export function byteLength(base64_string: string): [number, number];
    export function toByteArray(base64_string: string): Uint8Array|number[];
    export function fromByteArray(arr: Uint8Array|number[]): string;
  }
  
  export = base64_js;