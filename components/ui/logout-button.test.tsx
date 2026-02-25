import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import LogoutButton from "./logout-button"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe("LogoutButton", () => {
  const push = jest.fn()
  const refresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push, refresh })
    global.fetch = jest.fn()
  })

  it("renders the logout trigger button", () => {
    render(<LogoutButton />)

    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument()
  })

  it("logs out successfully and redirects to login", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })
    const user = userEvent.setup()

    render(<LogoutButton />)

    await user.click(screen.getByRole("button", { name: "Logout" }))
    await user.click(screen.getByRole("button", { name: "Yes, Logout" }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" })
      expect(toast.success).toHaveBeenCalledWith("logout success")
      expect(push).toHaveBeenCalledWith("/login")
      expect(refresh).toHaveBeenCalled()
    })
  })

  it("shows error toast and does not redirect when logout fails", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })
    const user = userEvent.setup()

    render(<LogoutButton />)

    await user.click(screen.getByRole("button", { name: "Logout" }))
    await user.click(screen.getByRole("button", { name: "Yes, Logout" }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Logout failed")
      expect(push).not.toHaveBeenCalled()
      expect(refresh).not.toHaveBeenCalled()
    })
  })
})