// > Homework 6  Comments for posts with auth  POST -> "/posts/:postId/comments": should create new comment; status 201; content: created comment;  used additional methods: POST -> /blogs, POST -> /posts, GET -> /comments/:commentId;
//
//
//
// Expected: success response
//
// Received: Request failed with status code 401
//
// Config:
//     url: comments/678514ecbebd4b43c27f4d46
// method: get
// response status: 401
// request body: undefined
// response data: "Unauthorized"
//
// 22 |     };
// 23 |
// > 24 |     expect(mappedError).printError(description);
// |                         ^
// 25 |   }
// 26 |
// 27 |   throw new Error(error.message);
//
// at handleTestError (src/tests/jest/back/testHelpers/handleTestError.ts:24:25)
// at src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:70:38
// at runMicrotasks (<anonymous>)
// at performPOSTTestFlow (src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:68:41)
// at Object.<anonymous> (src/tests/jest/back/describes/comments/comments-V2-describe.ts:97:7)
//
// > Homework 6  Comments for posts with auth  DELETE -> "/comments/:id": should delete comment by id; status 204;  used additional methods: POST -> /blogs, POST -> /posts, GET -> /comments/:id;
//
// expect(received).toBe(expected) // Object.is equality
//
// Expected: 404
// Received: 401
//
// 138 |
// 139 |   expect(deleteEntityResponseStatus).toBe(204);
// > 140 |   expect(statusAfterDeleting).toBe(404);
// |                               ^
// 141 | };
// 142 |
// 143 | export const performGETTestFlow = async <T>({
//
//     at performDELETETestFlow (src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:140:31)
// at runMicrotasks (<anonymous>)
// at Object.<anonymous> (src/tests/jest/back/describes/comments/comments-V2-describe.ts:230:7)
//
// > Homework 6  Comments for posts with auth  PUT -> "/comments/:commentId": should update comment by id; status 204;  used additional methods: POST -> /blogs, POST -> /posts, POST -> /posts/:postId/comments, GET -> /comments/:commentId;
//
//
//
// Expected: success response
//
// Received: Request failed with status code 401
//
// Config:
//     url: comments/678514fcbebd4b43c27f4d5a
// method: get
// response status: 401
// request body: undefined
// response data: "Unauthorized"
//
// 22 |     };
// 23 |
// > 24 |     expect(mappedError).printError(description);
// |                         ^
// 25 |   }
// 26 |
// 27 |   throw new Error(error.message);
//
// at handleTestError (src/tests/jest/back/testHelpers/handleTestError.ts:24:25)
// at src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:111:38
// at runMicrotasks (<anonymous>)
// at performPUTTestFlow (src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:109:41)
// at Object.<anonymous> (src/tests/jest/back/describes/comments/comments-V2-describe.ts:134:7)
//
// > Homework 6  Comments for posts with auth  GET -> "comments/:commentsId": should return status 200; content: comment by id;  used additional methods: POST -> /blogs, POST -> /posts, POST -> /posts/:postId/comments;
//
//
//
// Expected: success response
//
// Received: Request failed with status code 401
//
// Config:
//     url: comments/678514febebd4b43c27f4d5d
// method: get
// response status: 401
// request body: undefined
// response data: "Unauthorized"
//
// 22 |     };
// 23 |
// > 24 |     expect(mappedError).printError(description);
// |                         ^
// 25 |   }
// 26 |
// 27 |   throw new Error(error.message);
//
// at handleTestError (src/tests/jest/back/testHelpers/handleTestError.ts:24:25)
// at src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:83:38
// at runMicrotasks (<anonymous>)
// at performGETByIdTestFlow (src/tests/jest/back/testHelpers/performTestsFlow/performTestsFlow.ts:81:72)
// at Object.<anonymous> (src/tests/jest/back/describes/comments/comments-V2-describe.ts:202:7)
