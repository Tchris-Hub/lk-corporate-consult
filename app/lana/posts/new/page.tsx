import { requireAdmin } from "@/lib/auth";
import { ArticleEditor } from "@/app/lana/posts/editor";
export default async function NewPost() { await requireAdmin(); return <ArticleEditor />; }
