import Test from "@/features/Test/screens/Test";
import { render } from "@testing-library/react-native";

describe("Test Screen", () => {
  it("should render correctly", async () => {
    const { getByText } = await render(<Test />);
    expect(getByText("Test")).toBeTruthy();
  });
});
