import { describe, expect, it } from "vitest";

import { serializeMdx } from "./serialize-mdx";

describe("serializeMdx", () => {
  it("compiles GitHub-flavored tables and task lists into MDX components", async () => {
    const result = await serializeMdx(`
| System | Status |
| --- | --- |
| CMS | Ready |

- [x] Publish
`);

    expect(result.compiledSource).toContain("table");
    expect(result.compiledSource).toContain('type: "checkbox"');
    expect(result.compiledSource).toContain("checked: true");
  });
});
