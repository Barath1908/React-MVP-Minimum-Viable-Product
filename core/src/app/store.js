import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import sagaMiddleware from "./sagaMiddleware";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);