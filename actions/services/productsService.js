"use server";


let mockProducts = [
    {
        id: "1",
        name: "iPhone 15 Pro",
        price: 999,
        description: "Latest Apple flagship smartphone",
        category: "Electronics"
    },
    {
        id: "2",
        name: "MacBook Pro 16",
        price: 2499,
        description: "M3 Max processor, 32GB RAM",
        category: "Laptops"
    },
    {
        id: "3",
        name: "Sony WH-1000XM5",
        price: 399,
        description: "Wireless Noise Canceling Headphones",
        category: "Audio"
    }
];


const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
    try {
        await delay();

        return {
            success: true,
            data: [...mockProducts]
        };
    } catch (error) {
        console.error("DEBUG getProducts Error", error);
        return {
            success: false,
            message: "Failed to fetch products (Mock Error)"
        };
    }
}

export async function createProduct(productData) {
    try {
        await delay();

        const newProduct = {
            id: String(Date.now()), // توليد ID فريد
            name: productData.name || "Untitled Product",
            price: productData.price ? Number(productData.price) : 0,
            description: productData.description || "",
            category: productData.category || "General",
            ...productData
        };

        mockProducts.unshift(newProduct);

        return {
            success: true,
            data: newProduct,
            id: newProduct.id,
            message: "Product created successfully"
        };
    } catch (error) {
        console.error("DEBUG createProduct Error", error);
        return {
            success: false,
            message: "Failed to create product (Mock Error)"
        };
    }
}

export async function updateProduct(id, productData) {
    try {
        await delay();

        const index = mockProducts.findIndex((item) => String(item.id) === String(id));

        if (index === -1) {
            return {
                success: false,
                message: "Product not found"
            };
        }

        const updatedProduct = {
            ...mockProducts[index],
            ...productData,
            id: mockProducts[index].id 
        };

        mockProducts[index] = updatedProduct;

        return {
            success: true,
            data: updatedProduct,
            message: "Product updated successfully"
        };
    } catch (error) {
        console.error("DEBUG updateProduct Error", error);
        return {
            success: false,
            message: "Failed to update product (Mock Error)"
        };
    }
}

export async function deleteProduct(id) {
    try {
        await delay();

        const index = mockProducts.findIndex((item) => String(item.id) === String(id));

        if (index === -1) {
            return {
                success: false,
                message: "Product not found"
            };
        }

        const deletedProduct = mockProducts[index];
        mockProducts = mockProducts.filter((item) => String(item.id) !== String(id));

        return {
            success: true,
            data: deletedProduct,
            message: "Product deleted successfully"
        };
    } catch (error) {
        console.error("DEBUG deleteProduct Error", error);
        return {
            success: false,
            message: "Failed to delete product (Mock Error)"
        };
    }
}