
export interface Reducer<S, A> {
    (state: S, action: A): S;
}

/**
 * Will return a Combining Reducers, that will call the reducers in order.
 * It calls the next reducer when current reducer returns an unchanged state.
 * e.g. it can be used to add additional reducers and have a fallback reducer as default.
 */
export function combineReducers<S, A>(...reducers: Array<Reducer<S, A>>) {
    return (state: S, changes: A) => {
        return reducers.reduce((s, r, i, arr) => {
            const result = r(s, changes);
            if (!Object.is(state, result)) arr.slice(i); // eject reduce
            return result;
        }, state);
    };
}

export default combineReducers;
