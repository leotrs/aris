import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateCurrentMatch,
  highlightClass,
  currentHighlightClass,
} from "@/utils/highlightSearchMatches.js";

describe("highlightSearchMatches utils", () => {
  describe("updateCurrentMatch", () => {
    let mockMatches;

    beforeEach(() => {
      mockMatches = [
        {
          mark: {
            classList: {
              remove: vi.fn(),
              add: vi.fn(),
            },
          },
        },
        {
          mark: {
            classList: {
              remove: vi.fn(),
              add: vi.fn(),
            },
          },
        },
        {
          mark: {
            classList: {
              remove: vi.fn(),
              add: vi.fn(),
            },
          },
        },
      ];
    });

    it("should remove current highlight from all matches and add regular highlight", () => {
      updateCurrentMatch(mockMatches, 1);

      // All matches should have current highlight removed and regular highlight added
      mockMatches.forEach((match) => {
        expect(match.mark.classList.remove).toHaveBeenCalledWith(currentHighlightClass);
        expect(match.mark.classList.add).toHaveBeenCalledWith(highlightClass);
      });
    });

    it("should add current highlight to the specified match", () => {
      const currentIndex = 1;
      updateCurrentMatch(mockMatches, currentIndex);

      // The current match should have regular highlight removed and current highlight added
      expect(mockMatches[currentIndex].mark.classList.remove).toHaveBeenCalledWith(highlightClass);
      expect(mockMatches[currentIndex].mark.classList.add).toHaveBeenCalledWith(
        currentHighlightClass
      );
    });

    it("should handle edge case when currentIndex is negative", () => {
      updateCurrentMatch(mockMatches, -1);

      // All matches should have current highlight removed and regular highlight added
      mockMatches.forEach((match) => {
        expect(match.mark.classList.remove).toHaveBeenCalledWith(currentHighlightClass);
        expect(match.mark.classList.add).toHaveBeenCalledWith(highlightClass);
      });

      // No match should get current highlight since index is invalid
      mockMatches.forEach((match) => {
        expect(match.mark.classList.remove).not.toHaveBeenCalledWith(highlightClass);
        expect(match.mark.classList.add).not.toHaveBeenCalledWith(currentHighlightClass);
      });
    });

    it("should handle edge case when currentIndex is out of bounds", () => {
      updateCurrentMatch(mockMatches, 5);

      // All matches should have current highlight removed and regular highlight added
      mockMatches.forEach((match) => {
        expect(match.mark.classList.remove).toHaveBeenCalledWith(currentHighlightClass);
        expect(match.mark.classList.add).toHaveBeenCalledWith(highlightClass);
      });

      // No match should get current highlight since index is out of bounds
      mockMatches.forEach((match) => {
        expect(match.mark.classList.remove).not.toHaveBeenCalledWith(highlightClass);
        expect(match.mark.classList.add).not.toHaveBeenCalledWith(currentHighlightClass);
      });
    });

    it("should handle matches with no mark property", () => {
      const matchesWithoutMark = [
        { mark: null },
        { mark: mockMatches[1].mark },
        {
          /* no mark property */
        },
      ];

      // Should not throw an error
      expect(() => updateCurrentMatch(matchesWithoutMark, 1)).not.toThrow();

      // Only the match with a valid mark should have methods called
      expect(mockMatches[1].mark.classList.remove).toHaveBeenCalledWith(currentHighlightClass);
      expect(mockMatches[1].mark.classList.add).toHaveBeenCalledWith(highlightClass);
      expect(mockMatches[1].mark.classList.remove).toHaveBeenCalledWith(highlightClass);
      expect(mockMatches[1].mark.classList.add).toHaveBeenCalledWith(currentHighlightClass);
    });

    it("should handle empty matches array", () => {
      // Should not throw an error
      expect(() => updateCurrentMatch([], 0)).not.toThrow();
    });

    it("should handle zero index correctly", () => {
      updateCurrentMatch(mockMatches, 0);

      // First match should get current highlight
      expect(mockMatches[0].mark.classList.remove).toHaveBeenCalledWith(highlightClass);
      expect(mockMatches[0].mark.classList.add).toHaveBeenCalledWith(currentHighlightClass);

      // Other matches should only get regular highlight
      for (let i = 1; i < mockMatches.length; i++) {
        expect(mockMatches[i].mark.classList.remove).toHaveBeenCalledWith(currentHighlightClass);
        expect(mockMatches[i].mark.classList.add).toHaveBeenCalledWith(highlightClass);
        expect(mockMatches[i].mark.classList.remove).not.toHaveBeenCalledWith(highlightClass);
        expect(mockMatches[i].mark.classList.add).not.toHaveBeenCalledWith(currentHighlightClass);
      }
    });
  });
});
