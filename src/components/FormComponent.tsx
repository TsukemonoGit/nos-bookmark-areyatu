import { JSX, createSignal } from "solid-js";

function FormComponent({
  onSubmit,
  action,
  method,
  style,
  children,
}: {
  onSubmit: (formData: any) => void;
  action: string;
  method?: "get" | "post";
  style?: any;
  children?: JSX.Element | JSX.Element[];
}) {
  // フォームのデータを管理するためのシグナル
  const [formData, setFormData] = createSignal({});

  // フォームが送信されたときの処理
  function handleSubmit(event: Event) {
    event.preventDefault();
    // 外部の送信処理関数にフォームデータを渡す
    onSubmit(formData());
  }

  return (
    <form action={action} method={method} style={style} onSubmit={handleSubmit}>
      {/* childrenが存在する場合のみ処理を行う */}
      {children &&
        (Array.isArray(children) ? (
          // childrenが配列の場合
          children.map((child, index) => <div>{child}</div>)
        ) : (
          // childrenが単一の要素の場合
          <div>{children}</div>
        ))}
      <button type="submit">送信</button>
    </form>
  );
}

export default FormComponent;
