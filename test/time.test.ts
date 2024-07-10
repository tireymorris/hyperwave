import { describe, expect, it } from "bun:test";
import {
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  WEEKS,
  formatRelativeTime,
} from "util/time";

describe("formatRelativeTime", () => {
  it('should display "a few seconds ago" when delta is less than a minute', () => {
    const date = new Date(Date.now() - 30 * SECONDS);
    expect(formatRelativeTime(date)).toBe("a few seconds ago");
  });

  it('should display "a minute ago" when delta is less than 2 minutes', () => {
    const date = new Date(Date.now() - 1.5 * MINUTES);
    expect(formatRelativeTime(date)).toBe("a minute ago");
  });

  it('should display "5 minutes ago" when delta is less than 5 minutes', () => {
    const date = new Date(Date.now() - 5 * MINUTES);
    expect(formatRelativeTime(date)).toBe("5 minutes ago");
  });

  it('should display "10 minutes ago" when delta is less than 10 minutes', () => {
    const date = new Date(Date.now() - 10 * MINUTES);
    expect(formatRelativeTime(date)).toBe("10 minutes ago");
  });

  it('should display "15 minutes ago" when delta is less than 15 minutes', () => {
    const date = new Date(Date.now() - 15 * MINUTES);
    expect(formatRelativeTime(date)).toBe("15 minutes ago");
  });

  it('should display "an hour ago" when delta is less than an hour', () => {
    const date = new Date(Date.now() - 60 * MINUTES);
    expect(formatRelativeTime(date)).toBe("an hour ago");
  });

  it('should display "2 hours ago" when delta is less than 2 hours', () => {
    const date = new Date(Date.now() - 2 * HOURS);
    expect(formatRelativeTime(date)).toBe("2 hours ago");
  });

  it('should display "3 hours ago" when delta is less than 3 hours', () => {
    const date = new Date(Date.now() - 3 * HOURS);
    expect(formatRelativeTime(date)).toBe("3 hours ago");
  });

  it('should display "yesterday" when delta is less than 24 hours', () => {
    const date = new Date(Date.now() - 1 * DAYS);
    expect(formatRelativeTime(date)).toBe("yesterday");
  });

  it('should display "2 days ago" when delta is less than 2 days', () => {
    const date = new Date(Date.now() - 2 * DAYS);
    expect(formatRelativeTime(date)).toBe("2 days ago");
  });

  it('should display "several days ago" when delta is less than a week', () => {
    const date = new Date(Date.now() - 6 * DAYS);
    expect(formatRelativeTime(date)).toBe("6 days ago");
  });

  it('should display "a week ago" when delta is less than 2 weeks', () => {
    const date = new Date(Date.now() - 1 * WEEKS);
    expect(formatRelativeTime(date)).toBe("a week ago");
  });

  it('should display "several weeks ago" when delta is more than a week', () => {
    const date = new Date(Date.now() - 3 * WEEKS);
    expect(formatRelativeTime(date)).toBe("3 weeks ago");
  });

  it('should default to "a long time ago" when delta is more than 4 weeks', () => {
    const date = new Date(Date.now() - 5 * WEEKS);
    expect(formatRelativeTime(date)).toBe("5 weeks ago");
  });
});
