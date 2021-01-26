import { TestBed } from "@angular/core/testing";

import { AppEntryGuard } from "./app-entry.guard";

describe("AppEntryGuard", () => {
  let guard: AppEntryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppEntryGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
