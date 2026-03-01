import { render } from "@testing-library/react-native";

import Test from "./Test";
// SAMPLE STARTING TEST.
describe("<Test />", () => {
  test("Text renders correctly on HomeScreen", () => {
    const tree = render(<Test />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
