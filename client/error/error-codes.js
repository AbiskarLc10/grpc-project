const grpcErrorCodeMap = {
    0: { httpStatus: 200, message: "OK" },
    1: { httpStatus: 400, message: "Request was cancelled" },
    2: { httpStatus: 500, message: "Unknown error occurred" },
    3: { httpStatus: 400, message: "Invalid argument provided" },
    4: { httpStatus: 408, message: "Request timed out" },
    5: { httpStatus: 404, message: "Resource not found" },
    6: { httpStatus: 409, message: "Resource already exists" },
    7: { httpStatus: 403, message: "Permission denied" },
    8: { httpStatus: 429, message: "Resource exhausted" },
    9: { httpStatus: 400, message: "Failed precondition" },
    10: { httpStatus: 409, message: "Request aborted" },
    11: { httpStatus: 400, message: "Out of range" },
    12: { httpStatus: 501, message: "Feature not implemented" },
    13: { httpStatus: 500, message: "Internal server error" },
    14: { httpStatus: 503, message: "Service unavailable" },
    15: { httpStatus: 500, message: "Data loss" },
    16: { httpStatus: 401, message: "Unauthenticated" }
};

module.exports = grpcErrorCodeMap