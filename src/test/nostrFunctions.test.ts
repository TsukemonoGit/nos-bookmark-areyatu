// functions.test.js
import { expect, test } from "vitest";
import { sortBookmarkEventList } from "../libs/nostrFunctions";
import { bookmarks } from "./testData_bookmarks";
import fs from "fs";
test("sortBookmarkEventList", () => {
  const result = sortBookmarkEventList(bookmarks);
  console.log(result);
  const resultString = JSON.stringify(result, null, 2);
  fs.writeFileSync("sortedBookmarks.json", resultString);
  expect(result);
});
