import type { OutputRuntimeEnv } from "openclaw/plugin-sdk/runtime";
import { vi } from "vitest";

type RuntimeEnvOptions = {
  throwOnExit?: boolean;
};

export function createRuntimeEnv(options?: RuntimeEnvOptions): OutputRuntimeEnv {
  const throwOnExit = options?.throwOnExit ?? true;
  return {
    log: vi.fn(),
    error: vi.fn(),
    writeStdout: vi.fn(),
    writeJson: vi.fn(),
    exit: throwOnExit
      ? vi.fn((code: number): never => {
          throw new Error(`exit ${code}`);
        })
      : vi.fn(),
  };
}

export function createTypedRuntimeEnv<TRuntime>(
  options?: RuntimeEnvOptions,
  ascribe?: (runtime: OutputRuntimeEnv) => TRuntime,
): TRuntime {
  const runtime = createRuntimeEnv(options);
  return ascribe ? ascribe(runtime) : (runtime as TRuntime);
}

export function createNonExitingRuntimeEnv(): OutputRuntimeEnv {
  return createRuntimeEnv({ throwOnExit: false });
}

export function createNonExitingTypedRuntimeEnv<TRuntime>(
  ascribe?: (runtime: OutputRuntimeEnv) => TRuntime,
): TRuntime {
  return createTypedRuntimeEnv<TRuntime>({ throwOnExit: false }, ascribe);
}
