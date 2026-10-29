// 一般ユーザー向け画面「ご案内」タブ。改行をそのまま表示し、10行を超えたら「…」で省略する
export default function InformationPanel({ information }: { information: string }) {
  return (
    <div className="flex justify-center">
      <p className="line-clamp-10 w-[20em] text-base whitespace-pre-wrap break-words">
        {information}
      </p>
    </div>
  );
}
