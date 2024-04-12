import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";

// Mocking the modules and Chrome API
jest.mock("../Logo", () => () => <div>Logo Component</div>);
jest.mock("../components/Settings", () => () => <div>Settings Component</div>);
global.chrome = {
  runtime: {
    getManifest: () => ({ version: "1.2.3" }),
  },
};

describe("App component tests", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders without crashing", () => {
    expect(screen.getByText("Logo Component")).toBeInTheDocument();
    expect(screen.getByText("Settings Component")).toBeInTheDocument();
  });

  test("initial states are set correctly", () => {
    expect(screen.getByText("Leave a Review ⭐️")).toBeInTheDocument();
  });

  test("version is fetched and displayed correctly", async () => {
    expect(await screen.findByText("Version 1.2.3")).toBeInTheDocument();
  });

  test("clicking the review button updates its label", () => {
    fireEvent.click(screen.getByText("Leave a Review ⭐️"));
    expect(screen.getByText("Thank you!")).toBeInTheDocument();
  });
});
