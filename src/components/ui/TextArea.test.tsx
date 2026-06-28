import { render, screen } from "@testing-library/react";
import TextArea from "./TextArea";

describe("TextArea", () => {
  it("error が未指定のとき border-red-500 クラスが付かない", () => {
    render(<TextArea value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveClass("border-red-500");
  });

  it("error を渡すと border-red-500 クラスが付く", () => {
    render(
      <TextArea
        value=""
        onChange={() => {}}
        error="詳細は10文字以上で入力してください"
      />,
    );
    expect(screen.getByRole("textbox")).toHaveClass("border-red-500");
  });
});
