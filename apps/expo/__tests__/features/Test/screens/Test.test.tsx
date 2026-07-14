import { render } from "@testing-library/react-native";

import Test from "@/features/Test/screens/Test";

describe("Test Screen", () => {
  it("should render correctly", async () => {
    const { getByText } = await render(<Test />);
    expect(getByText("Test")).toBeTruthy();
  });
});
