export declare type FontSrc = {
    family: string;
    path: string;
    style?: string;
    weight?: string;
};
declare type SetupFonts = {
    tagId?: string;
    sources?: string[];
};
export declare const setupFonts: ({ sources: src, tagId }?: SetupFonts) => {
    setFont: ({ family, path, style, weight }?: FontSrc) => void;
};
export {};
