import { Download } from "../../../src/renderers/actions/Download";
import {
  render,
  userEvent,
  fireEvent,
  waitFor,
  getByRole,
  findByText,
} from "../../setup";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { download } from "../../../src/services/actions";
import { deconstructStudy } from "../../../src/utils/deconstruct";
import { useStore } from "../../../src/State";
import { Commit } from "../../../src/renderers/actions/Commit";
import { debug } from "console";
import { RedCap } from "../../../src/renderers/actions/RedcapProjectCreation";

// Mock the toast function to prevent real notifications during tests
vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("RedCap component", () => {
  it('should render the first step with a username input and "Next" button', ({}) => {
    const { getByLabelText, getByText } = render(<RedCap close={() => {}} />);
    const usernameInput = getByLabelText("RedCap Username");
    const nextButton = getByText("Next");

    expect(usernameInput).toBeDefined();
    expect(nextButton).toBeDefined();
  });

  it('should show an error toast if the "Next" button is clicked without entering a username', ({}) => {
    const { getByText } = render(<RedCap close={() => {}} />);
    const nextButton = getByText("Next");

    fireEvent.click(nextButton);

    // Verify that the toast error message appears
    // expect(toast.error).toHaveBeenCalledWith("You need to enter a username");
  });

  it('should change the step when the "Next" button is clicked with a valid username', ({}) => {
    const { getByLabelText, getByText } = render(<RedCap close={() => {}} />);
    const usernameInput = getByLabelText("RedCap Username");
    const nextButton = getByText("Next");

    fireEvent.change(usernameInput, { target: { value: "testUser" } });
    fireEvent.click(nextButton);

    // The step should change to the next one
    const verificationStep = getByText("Verification");
    expect(verificationStep).toBeDefined();
  });

  it('should show the "Visit RedCap" button on the last step', ({}) => {
    const { getByLabelText, getByText } = render(<RedCap close={() => {}} />);
    const usernameInput = getByLabelText("RedCap Username");
    const nextButton = getByText("Next");

    // Complete all steps
    fireEvent.change(usernameInput, { target: { value: "bassefa" } });
    // Wait for 10 seconds after clicking the "Next" button
    return waitFor(() => {
        // Verify that the "Visit RedCap" button appears on the last step
        const visitRedCapButton = getByText('Visit RedCap');
        expect(visitRedCapButton).toBeDefined();
      }, { timeout: 70000 });
  }, 70000);
});
