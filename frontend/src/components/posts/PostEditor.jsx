import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { HiOutlinePhoto, HiOutlineXMark } from "react-icons/hi2";
import Button from "../ui/Button";
import { Input } from "../ui/Field";
import { stripHtml, readingTime } from "../../lib/format";
import { uploadImage, validateImage, MAX_IMAGE_MB } from "../../lib/upload";
import { useApi } from "../../hooks/useApi";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { cn } from "../../lib/cn";

const toolbar = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block", "link"],
  ["clean"],
];

const modules = { toolbar };

export default function PostEditor({ initial, onSubmit, submitLabel }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const errorMessage = useErrorMessage();
  const { data: categoryData } = useApi("/post/categories");
  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category && initial.category !== "uncategorized" ? initial.category : "",
    content: initial?.content || "",
    image: initial?.image || "",
  });
  const [progress, setProgress] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const textLength = stripHtml(form.content).length;
  const errors = {
    title: form.title.trim().length < 3 ? t("errors.TITLE_TOO_SHORT") : null,
    content: textLength < 20 ? t("errors.CONTENT_TOO_SHORT") : null,
  };

  const upload = async (file) => {
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) return toast.error(t(`errors.${invalid}`));
    try {
      setProgress(0);
      const url = await uploadImage(file, "posts", setProgress);
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      toast.error(t("errors.UPLOAD_FAILED"));
    } finally {
      setProgress(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.title || errors.content) return;

    setSaving(true);
    try {
      const body = {
        title: form.title.trim(),
        content: form.content,
        ...(form.category.trim() && { category: form.category.trim().toLowerCase() }),
        ...(form.image && { image: form.image }),
      };
      const { post } = await onSubmit(body);
      toast.success(t("editor.saved"));
      navigate(`/post/${post.slug}`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]" noValidate>
      <div className="min-w-0 space-y-6">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={t("editor.titlePlaceholder")}
          aria-label={t("editor.title")}
          maxLength={150}
          className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-gray-300 focus-visible:ring-0 sm:text-4xl dark:placeholder:text-gray-700"
        />
        {submitted && errors.title && <p className="-mt-4 text-xs text-red-600">{errors.title}</p>}

        <ReactQuill
          theme="snow"
          value={form.content}
          onChange={(content) => setForm((prev) => ({ ...prev, content }))}
          modules={modules}
          placeholder={t("editor.contentPlaceholder")}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span className={cn(submitted && errors.content && "text-red-600")}>{submitted && errors.content}</span>
          <span className="font-mono">
            {t("editor.characters", { count: textLength })} · {t("post.readingTime", { count: readingTime(form.content) })}
          </span>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="space-y-6 rounded-2xl border border-gray-200 p-5 lg:sticky lg:top-24 dark:border-gray-800">
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">{t("editor.cover")}</p>
            {form.image ? (
              <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <img src={form.image} alt="" className="aspect-[16/9] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  aria-label={t("editor.removeCover")}
                  className="absolute right-2 top-2 rounded-md bg-gray-950/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                >
                  <HiOutlineXMark className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  upload(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center text-xs text-gray-500 transition-colors",
                  dragging ? "border-brand-500 bg-brand-50 dark:bg-brand-500/5" : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                )}
              >
                {progress !== null ? (
                  <>
                    <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <div className="h-full bg-brand-500 transition-[width]" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="font-mono">{progress}%</span>
                  </>
                ) : (
                  <>
                    <HiOutlinePhoto className="h-6 w-6" />
                    <span>{t("editor.dropImage")}</span>
                    <span className="text-gray-400">{t("editor.imageLimit", { mb: MAX_IMAGE_MB })}</span>
                  </>
                )}
                <input type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
              </label>
            )}
          </div>

          <div>
            <Input
              label={t("editor.category")}
              list="categories"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder={t("editor.categoryPlaceholder")}
              maxLength={40}
            />
            <datalist id="categories">
              {categoryData?.categories?.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="submit" loading={saving} disabled={progress !== null}>
              {submitLabel}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      </aside>
    </form>
  );
}
