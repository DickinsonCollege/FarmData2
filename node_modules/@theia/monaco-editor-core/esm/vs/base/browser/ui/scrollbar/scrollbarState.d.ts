export declare class ScrollbarState {
    /**
     * For the vertical scrollbar: the width.
     * For the horizontal scrollbar: the height.
     */
    private _scrollbarSize;
    /**
     * For the vertical scrollbar: the height of the pair horizontal scrollbar.
     * For the horizontal scrollbar: the width of the pair vertical scrollbar.
     */
    private _oppositeScrollbarSize;
    /**
     * For the vertical scrollbar: the height of the scrollbar's arrows.
     * For the horizontal scrollbar: the width of the scrollbar's arrows.
     */
    private readonly _arrowSize;
    /**
     * For the vertical scrollbar: the viewport height.
     * For the horizontal scrollbar: the viewport width.
     */
    private _visibleSize;
    /**
     * For the vertical scrollbar: the scroll height.
     * For the horizontal scrollbar: the scroll width.
     */
    private _scrollSize;
    /**
     * For the vertical scrollbar: the scroll top.
     * For the horizontal scrollbar: the scroll left.
     */
    private _scrollPosition;
    /**
     * `visibleSize` - `oppositeScrollbarSize`
     */
    private _computedAvailableSize;
    /**
     * (`scrollSize` > 0 && `scrollSize` > `visibleSize`)
     */
    private _computedIsNeeded;
    private _computedSliderSize;
    private _computedSliderRatio;
    private _computedSliderPosition;
    constructor(arrowSize: number, scrollbarSize: number, oppositeScrollbarSize: number, visibleSize: number, scrollSize: number, scrollPosition: number);
    clone(): ScrollbarState;
    setVisibleSize(visibleSize: number): boolean;
    setScrollSize(scrollSize: number): boolean;
    setScrollPosition(scrollPosition: number): boolean;
    setScrollbarSize(scrollbarSize: number): void;
    setOppositeScrollbarSize(oppositeScrollbarSize: number): void;
    private static _computeValues;
    private _refreshComputedValues;
    getArrowSize(): number;
    getScrollPosition(): number;
    getRectangleLargeSize(): number;
    getRectangleSmallSize(): number;
    isNeeded(): boolean;
    getSliderSize(): number;
    getSliderPosition(): number;
    /**
     * Compute a desired `scrollPosition` such that `offset` ends up in the center of the slider.
     * `offset` is based on the same coordinate system as the `sliderPosition`.
     */
    getDesiredScrollPositionFromOffset(offset: number): number;
    /**
     * Compute a desired `scrollPosition` from if offset is before or after the slider position.
     * If offset is before slider, treat as a page up (or left).  If after, page down (or right).
     * `offset` and `_computedSliderPosition` are based on the same coordinate system.
     * `_visibleSize` corresponds to a "page" of lines in the returned coordinate system.
     */
    getDesiredScrollPositionFromOffsetPaged(offset: number): number;
    /**
     * Compute a desired `scrollPosition` such that the slider moves by `delta`.
     */
    getDesiredScrollPositionFromDelta(delta: number): number;
}
//# sourceMappingURL=scrollbarState.d.ts.map