import { useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/vs2015.css";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import CodeSnippetWindow from "../components/UI/CodeSnippetWindow";
import InputField from "../components/UI/InputField";
import Select from "../components/UI/Select";
import Toast from "../components/UI/Toast";
import EditorModule from "react-simple-code-editor";
const Editor = EditorModule.default || EditorModule;
import { createPost } from "../services/postService";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);

const CATEGORY_OPTIONS = ["Technology", "Design", "Programming", "Lifestyle", "Business"];
const LANGUAGE_OPTIONS = ["javascript", "typescript", "html", "css", "json", "python", "bash"];

const EXTENSION_LANGUAGE_MAP = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  py: "python",
  css: "css",
  scss: "css",
  json: "json",
  html: "html",
  htm: "html",
  sh: "bash",
  bash: "bash",
};

function sanitizeHtml(raw = "") {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    category: CATEGORY_OPTIONS[0],
    isPremium: false,
  });
  const [snippetLanguage, setSnippetLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetFilename, setSnippetFilename] = useState("");
  const [snippetScrollTop, setSnippetScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [editorMode, setEditorMode] = useState("Mixed");

  const modeOptions = ["Mixed", "Code", "Media"];

  const snippetLineCount = useMemo(() => (snippetCode.trim() ? snippetCode.split("\n").length : 0), [snippetCode]);
  const snippetEditorLineNumbers = useMemo(() => {
    const lines = snippetCode.replace(/\r\n/g, "\n").split("\n");
    const count = Math.max(lines.length, 1);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [snippetCode]);

  const highlightedSnippet = useMemo(() => {
    const safeCode = snippetCode || "";
    if (!safeCode) return "";
    try {
      return hljs.highlight(safeCode, { language: snippetLanguage }).value;
    } catch {
      return sanitizeHtml(safeCode);
    }
  }, [snippetCode, snippetLanguage]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSnippetUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const code = await file.text();
      setSnippetCode(code);
      setSnippetFilename(file.name);

      const extension = file.name.split(".").pop()?.toLowerCase();
      const detectedLanguage = EXTENSION_LANGUAGE_MAP[extension];
      if (detectedLanguage) setSnippetLanguage(detectedLanguage);
    } catch {
      setToast({ message: "Could not read code file", type: "error" });
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedContent = formData.content.trim();
    const normalizedSnippet = snippetCode.trim();

    if (!normalizedContent && !normalizedSnippet) {
      setToast({ message: "Add post content or a code snippet before publishing", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("isPremium", formData.isPremium);

      const fullContent = [
        normalizedContent,
        normalizedSnippet ? `\`\`\`${snippetLanguage}\n${normalizedSnippet}\n\`\`\`` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      payload.append("content", fullContent);
      if (formData.image) payload.append("image", formData.image);

      await createPost(payload);
      setToast({ message: "Post published successfully", type: "success" });
      setFormData({ title: "", content: "", image: null, category: CATEGORY_OPTIONS[0], isPremium: false });
      setSnippetLanguage(LANGUAGE_OPTIONS[0]);
      setSnippetCode("");
      setSnippetFilename("");
    } catch (error) {
      setToast({ message: error.response?.data?.msg || "Failed to publish post", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-6">
        <Card className="overflow-hidden border-brand-300/20 bg-gradient-to-br from-zinc-950 to-brand-900/20 p-0">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <span className="app-chip">Composer</span>
              <h1 className="section-title">Craft a post with code, media, and context</h1>
              <p className="section-copy">Reliable post composer with snippet upload and syntax-highlighted preview.</p>
              <div className="flex flex-wrap gap-2">
                {modeOptions.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setEditorMode(mode)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${editorMode === mode
                      ? "border-brand-300/45 bg-brand-300/15 text-brand-100"
                      : "border-white/10 bg-black text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {["Code upload supported", "Language-aware preview", "Consistent UI controls"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <InputField
                  label="Post title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a high-signal title"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Category</label>
                <Select
                  name="category"
                  value={formData.category}
                  options={CATEGORY_OPTIONS}
                  onChange={handleChange}
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-zinc-100 hover:border-white/20 focus:border-brand-300 focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black p-4">
              <input
                id="isPremium"
                name="isPremium"
                type="checkbox"
                checked={formData.isPremium}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-brand-400"
              />
              <div>
                <p className="text-sm font-semibold text-zinc-100">Premium content</p>
                <p className="text-xs text-zinc-500">Gate this post for subscribers only.</p>
              </div>
            </label>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-5">
                <InputField
                  label="Post narrative"
                  id="content"
                  name="content"
                  type="textarea"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write context, explanation, outcomes, and links..."
                  rows="8"
                  className="min-h-[220px] leading-7"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Cover image</label>
                  <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black px-6 py-6 text-center hover:border-brand-300/45">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.files[0] }))}
                      className="hidden"
                    />
                    <span className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200">Upload image</span>
                    <p className="mt-2 text-xs text-zinc-500">Drop an illustration or screenshot.</p>
                  </label>
                </div>

                {formData.image && (
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <img src={URL.createObjectURL(formData.image)} alt="Preview" className="h-56 w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <p className="app-chip">Live Preview</p>
                  <h3 className="mt-3 text-xl font-semibold text-zinc-100">{formData.title || "Untitled post"}</h3>
                  <p className="mt-2 line-clamp-4 text-sm text-zinc-400">{formData.content || "Your post narrative appears here."}</p>
                  <div className="mt-3 space-y-1 text-xs text-zinc-500">
                    <p>Mode: {editorMode}</p>
                    <p>Category: {formData.category}</p>
                    <p>Snippet lines: {snippetLineCount}</p>
                    <p>Premium: {formData.isPremium ? "Yes" : "No"}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="app-chip">Checklist</p>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                    <li>Keep title specific</li>
                    <li>Add clear explanation</li>
                    <li>Attach snippet if needed</li>
                    <li>Review before publish</li>
                  </ul>
                </Card>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-black p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Code snippet upload</p>
                  <p className="text-xs text-zinc-500">Snippet library: highlight.js</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={snippetLanguage}
                    options={LANGUAGE_OPTIONS}
                    onChange={(e) => setSnippetLanguage(e.target.value)}
                    className="w-[140px] rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200 hover:border-white/20 focus:border-brand-300 focus:outline-none"
                  />

                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 hover:border-white/20">
                    Upload code
                    <input
                      type="file"
                      accept=".txt,.js,.mjs,.cjs,.ts,.jsx,.tsx,.py,.json,.html,.htm,.css,.scss,.sh,.bash"
                      className="hidden"
                      onChange={handleSnippetUpload}
                    />
                  </label>
                </div>
              </div>

              {snippetFilename && <p className="text-xs text-brand-200">Loaded: {snippetFilename}</p>}

              <div className="space-y-6">
                <div className="snippet-window snippet-window--editor">
                  <div className="snippet-window__chrome">
                    <span className="snippet-window__dot snippet-window__dot--red" />
                    <span className="snippet-window__dot snippet-window__dot--yellow" />
                    <span className="snippet-window__dot snippet-window__dot--green" />
                  </div>
                  <div className="snippet-window__editor-shell">
                    <div className="snippet-window__line-track" aria-hidden="true">
                      <ol className="snippet-window__lines" style={{ transform: `translateY(-${snippetScrollTop}px)` }}>
                        {snippetEditorLineNumbers.map((lineNumber) => (
                          <li key={lineNumber}>{lineNumber}</li>
                        ))}
                      </ol>
                    </div>
                    <div
                      className="w-full h-[400px] overflow-auto snippet-editor"
                      onScroll={(event) => setSnippetScrollTop(event.target.scrollTop)}
                    >
                      <Editor
                        value={snippetCode}
                        onValueChange={(code) => setSnippetCode(code)}
                        highlight={(code) => {
                          const safeCode = code || "";
                          if (!safeCode) return "";
                          try {
                            return hljs.highlight(safeCode, { language: snippetLanguage }).value;
                          } catch {
                            return sanitizeHtml(safeCode);
                          }
                        }}
                        padding={16}
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: "0.95rem",
                          backgroundColor: "transparent",
                          minHeight: "100%",
                        }}
                        className="text-[#e4e4e7]"
                        textareaClassName="focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Preview</p>
                    <p className="text-[10px] text-zinc-600">Read-only</p>
                  </div>
                  <CodeSnippetWindow
                    code={snippetCode}
                    highlightedHtml={highlightedSnippet}
                    emptyText="No snippet yet."
                    maxHeight={400}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <Button type="button" variant="ghost">Save Draft</Button>
              <Button type="submit" disabled={loading}>{loading ? "Publishing..." : "Publish Post"}</Button>
            </div>
          </form>
        </Card>
      </div>

      <aside className="hidden space-y-4 2xl:block">
        <Card className="p-4">
          <p className="app-chip">Snippet Tips</p>
          <p className="mt-3 text-sm text-zinc-400">Keep snippets focused. Include only the part readers can apply immediately.</p>
        </Card>
      </aside>
    </div>
  );
}
