import { describe, it, expect, beforeEach } from "vitest";
import router from "@/router";

describe("router configuration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("contains the expected routes", () => {
    const paths = router.getRoutes().map((r) => r.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "/login",
        "/register",
        "/",
        "/file/:file_id",
        "/account",
        "/settings",
        "/:pathMatch(.*)*",
      ])
    );
    const notFoundRoute = router.getRoutes().find((r) => r.name === "NotFound");
    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute.path).toBe("/:pathMatch(.*)*");
  });

  it("redirects to /login when navigating to an auth-protected route without token", async () => {
    await router.push("/account");
    expect(router.currentRoute.value.path).toBe("/login");
  });

  it("allows access to public pages without token", async () => {
    await router.push("/login");
    expect(router.currentRoute.value.path).toBe("/login");
    await router.push("/register");
    expect(router.currentRoute.value.path).toBe("/register");
  });

  it("allows access to protected routes when token is present", async () => {
    localStorage.setItem("accessToken", "token");
    await router.push("/account");
    expect(router.currentRoute.value.path).toBe("/account");
    await router.push("/");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("redirects unknown routes to login without token, and to NotFound with token", async () => {
    await router.push("/some/random/path");
    expect(router.currentRoute.value.path).toBe("/login");

    localStorage.setItem("accessToken", "token");
    await router.push("/some/random/path");
    expect(router.currentRoute.value.name).toBe("NotFound");
    expect(router.currentRoute.value.path).toBe("/some/random/path");
  });
});
