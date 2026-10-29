import { updateInformation } from "@/actions/news";
import TextSaveForm from "@/components/organisms/TextSaveForm";
import { INFORMATION_MAX_CHARS } from "@/utils/validation";

// 管理者画面「ご案内」タブ
export default function InformationTabEditor({ information }: { information: string }) {
  return (
    <section className="rounded-2xl bg-card p-3">
      <TextSaveForm
        id="information"
        label="ご案内（80文字以内）"
        initialValue={information}
        maxChars={INFORMATION_MAX_CHARS}
        multiline
        onSave={updateInformation}
      />
    </section>
  );
}
