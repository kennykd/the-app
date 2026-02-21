import { render, screen } from "@testing-library/react"

import { Button } from "./button"

describe("Button", () => {
  it("renders with provided label", () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
  })
})
