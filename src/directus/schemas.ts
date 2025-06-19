import { RegularCollections } from "@directus/sdk";
import { ExternalExceptionFilter } from "@nestjs/core/exceptions/external-exception-filter";

export interface Schema {
    product: product[];

    category: category[];

    register: register[];

    // tag: {
    //     id: string;               // UUID
    //     name: string;
    // };

    // product_tag: {
    //     id: number;               // thường là int autoincrement
    //     product_id: string;       // UUID → product.id
    //     tag_id: string;           // UUID → tag.id
    // };

    // users: {
    //     id: string;
    //     email: string;
    //     first_name?: string;
    //     last_name?: string;
    //     role: string;
    //     status: string;
    // };

    // files: {
    //     id: string;
    //     filename_download: string;
    //     title?: string;
    //     type: string;             // MIME type
    // };
};


export interface product {
    id: string;              // UUID
    name: string;
    price: number;
    description?: string;   // có thể null
    image?: string | null;     // file id (UUID)
    category: string | null;  // UUID từ bảng category
    status?: string;          // archived / draft...
    sort?: number;
}

export interface category {
    id: string;              // UUID
    name: string;
}

export interface register {
    id: string;
    status: string;
    full_name: string;
    email: string;
    phone: string;
    university: string;
    stock_code: string;
    rank: string;
    NAV: number;
}