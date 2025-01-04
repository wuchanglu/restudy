// custom-file-types.d.ts

declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.jpeg" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

// 你可以根据需要添加更多文件类型