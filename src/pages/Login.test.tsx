import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AuthContext } from "@/contexts/AuthContext";
import { AppConfigProvider } from "@/contexts/AppConfigContext";

// Mock do useAuth
vi.mock("@/contexts/useAuth", () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(undefined),
    dataMode: null,
  }),
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Login Component", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should allow the user to select data mode and store it in localStorage", async () => {
    render(
      <AppConfigProvider>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            dataMode: null,
            isAuthenticated: true,
            user: null,
            logout: vi.fn(),
            isLoading: false,
            hasPermission: vi.fn(),
          }}
        >
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthContext.Provider>
      </AppConfigProvider>
    );

    // Debugging: Log the initial state of localStorage
    console.log("Initial localStorage:", localStorage.getItem("dataMode"));

    // Select "Criar Dados Novos"
    const newDataRadio = screen.getByLabelText("Criar Dados Novos");
    await waitFor(() => fireEvent.click(newDataRadio));

    // Debugging: Log the state of localStorage after selecting the radio button
    console.log(
      "After selecting radio button:",
      localStorage.getItem("dataMode")
    );

    // Submit the form
    const form = screen.getByTestId("login-form");
    fireEvent.submit(form);

    // Debugging: Log the state of localStorage after form submission
    console.log("After form submission:", localStorage.getItem("dataMode"));

    // Check localStorage
    expect(localStorage.getItem("useDemoData")).toBe("false");
  });
});
