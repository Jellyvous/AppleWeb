import React, { useState, useEffect } from "react";
import { Upload, Button, Form, Modal, Select, InputNumber, Space } from "antd";
import axiosClient from "../../../services/axiosClient";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import { useQuery } from "@tanstack/react-query";
import InputComponent from "../../../components/InputComponent/InputComponent";
import { WrapperUploadFile } from "./style";
import { getBase64 } from "../../../utils";
import TableComponent from "../../../components/TableComponent/TableComponent";
import { UploadOutlined } from '@ant-design/icons';

import "./index.css";
import * as ProductService from "../../../services/ProductService";
import * as ProductTypeService from "../../../services/ProductTypeService";
import { useMutationHooks } from "../../../hooks/useMutationHooks";

const INITIAL_STATE = {
    name: "",
    image: "",
    type: "",
    price: "",
    countInStock: "",
    rating: "",
    discount: "",
    sold: "",
    description: "",
};

const Product = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [rowSelected, setRowSelected] = useState("");
    const [form] = Form.useForm();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [productTypes, setProductTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const alertMessages = {
        productCreated: "Thêm sản phẩm thành công",
        productUpdated: "Sửa sản phẩm thành công",
        productExists: "Sản phẩm này đã tồn tại!",
    };

    const mutation = useMutationHooks(async (data) => {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            discount,
            sold,
            description,
        } = data;

        if (editingProductId) {
            const res = await ProductService.updateProduct(editingProductId, {
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                discount,
                sold,
                description,
            });
            return res;
        } else {
            const res = await ProductService.createProduct({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                discount,
                sold,
                description,
            });
            return res;
        }
    });

    const queryProduct = useQuery({
        queryKey: ["product"],
        queryFn: ProductService.getAllProduct,
    });
    const { data: products } = queryProduct;

    const showDeleteConfirmation = (productId) => {
        setDeletingProductId(productId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteConfirmed = async () => {
        await axiosClient.delete(`product/deleteProduct/${deletingProductId}`, {
            _id: deletingProductId,
        });

        queryProduct.refetch();
        setIsDeleteModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingProductId(null);
        form.resetFields();
    };

    const onFinish = async (values) => {
        const isNameExists = products?.data?.some(
            (item) =>
                item.name.toLowerCase() === values.name.toLowerCase() &&
                item._id !== editingProductId
        );

        if (isNameExists) {
            alert("Sản phẩm này đã tồn tại!");
            return;
        }

        try {
            // const image = values.images.map((image) => image.originFileObj);
            const images = values.images; // Array of uploaded images

            // Convert each image to base64 using getBase64
            const image = await Promise.all(
                images.map(async (image) => await getBase64(image.originFileObj))
            );

            const data = await mutation.mutateAsync({ ...values, image });

            if (
                data?.status === "OK" &&
                data?.message === "Product created successfully"
            ) {
                handleCancel();
                alert("Thêm sản phẩm thành công");

                queryProduct.refetch();
            }

            if (data?.status === "OK" && data?.message === "UPDATE PRODUCT SUCCESS") {
                handleCancel();
                alert("Sửa sản phẩm thành công");

                queryProduct.refetch();
            }
        } catch (error) {
            console.error("Error creating Product:", error);
        }
    };

    // const handleOnchangeAvatar = async ({ fileList }) => {
    //     const file = fileList[0];
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     form.setFieldsValue({
    //         image: file.preview,
    //     });
    // };

    const editProduct = (productId) => {
        const selectedProduct = products.data.find(
            (item) => item._id === productId
        );
        if (selectedProduct) {
            setIsModalOpen(true);
            setEditingProductId(productId);
            form.setFieldsValue({
                name: selectedProduct.name,
                image: selectedProduct.image,
                type: selectedProduct.type,
                price: selectedProduct.price,
                countInStock: selectedProduct.countInStock,
                rating: selectedProduct.rating,
                discount: selectedProduct.discount,
                sold: selectedProduct.sold,
                description: selectedProduct.description,
            });
        }
    };

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = ProductService.deleteManyProduct(ids, token);
        return res;
    });
    const handleDeleteManyProducts = (ids) => {
        Modal.confirm({
            title: "Xác nhận xoá",
            content: "Bạn có chắc chắn muốn xoá tất cả sản phẩm?",
            okText: "Xoá",
            cancelText: "Hủy",
            onOk: async () => {
                mutationDeletedMany.mutate(
                    { ids: ids },
                    {
                        onSettled: () => {
                            queryProduct.refetch();
                        },
                    }
                );
            },
        });
    };
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const response = await ProductTypeService.getCountProductType();
                setProductTypes(response.data);
                form.setFieldsValue({
                    type: response.data.length > 0 ? response.data[0]._id : null,
                });
            } catch (error) {
                console.error("Error fetching product types:", error);
            }
        };

        fetchProductTypes();
    }, [form]);

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,

        },

        {
            title: "Tên",
            dataIndex: "name",
            key: "name",

        },
        {
            title: "Hình Ảnh",
            dataIndex: "image",
            key: "image",
            render: (images) => (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {images.map((img, index) => (
                        <div key={index} style={{ flex: "0 0 calc(33.33% - 10px)", margin: "0 5px 10px 0" }}>
                            <img
                                src={img}
                                alt={`product-${index}`}
                                style={{ width: "50px", height: "auto" }}
                            />
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "Loại sản phẩm",
            dataIndex: "type",
            key: "type",
            render: (type) => {
                const productType = productTypes.find((pt) => pt._id === type);
                return productType ? productType.name : "N/A";
            },
        },

        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => a.price - b.price
        },
        {
            title: "Giảm giá",
            dataIndex: "discount",
            key: "discount",
            sorter: (a, b) => a.discount - b.discount
        },
        {
            title: "Số lượng",
            dataIndex: "countInStock",
            key: "countInStock",
            sorter: (a, b) => a.countInStock - b.countInStock
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            sorter: (a, b) => a.rating - b.rating
        },
        {
            title: "Đã bán",
            dataIndex: "sold",
            key: "sold",
            sorter: (a, b) => a.sold - b.sold
        },
        {
            title: "Thông tin chi tiết",
            dataIndex: "description",
            key: "description",
        },

        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space className="action-icons-container" size="middle">
                    <a onClick={() => editProduct(record._id)}>Chỉnh sửa</a>
                    <a onClick={() => showDeleteConfirmation(record._id)}>Xoá</a>
                </Space>
            ),
        },
    ];

    const handleChangeSelect = (value) => {
        form.setFieldsValue({
            type: value,
        });
        setCurrentPage(1);
    };

    const isLoadingProducts = queryProduct.isLoading;

    const dataTable = products?.data
        ?.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        ?.map((product) => ({
            key: product._id,
            _id: product._id,
            name: product.name,
            image: product.image,
            type: product.type,
            price: product.price,
            countInStock: product.countInStock,
            rating: product.rating,
            discount: product.discount,
            sold: product.sold,
            description: product.description,
        }))
        .reverse();

    return (
        <div className="dashboard_category">
            <div className="dashboard_category-add">
                <button onClick={() => setIsModalOpen(true)}>Thêm mới</button>
            </div>
            <ModalComponent
                forceRender
                title="Tạo sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={onFinish}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: "Tên sản phẩm!" }]}
                    >
                        <InputComponent />
                    </Form.Item>
                    <Form.Item
                        label="Hình ảnh"
                        name="images"
                        rules={[{ required: true, message: "Chọn hình ảnh!" }]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={form.getFieldValue('images')}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => form.setFieldsValue({ images: fileList })}
                        >
                            {form.getFieldValue('images') && form.getFieldValue('images').length >= 4 ? null : (
                                <div>
                                    <Button icon={<UploadOutlined />} size="small" />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            { required: true, message: "Please select a product type!" },
                        ]}
                    >
                        <Select
                            placeholder="Select a product type"
                            onChange={handleChangeSelect}
                        >
                            {productTypes.map((type) => (
                                <Select.Option key={type._id} value={type._id}>
                                    {type.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, message: "Nhập giá sản phẩm!" }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        label="% Giảm giá"
                        name="discount"
                        rules={[{ required: true, message: "Nhập Giảm giá!" }]}
                    >
                        <InputNumber min={0} max={100} />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="countInStock"
                        rules={[{ required: true, message: "Nhập Số lượng!" }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Đã bán" name="sold">
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Sao"
                        name="rating"
                        rules={[{ required: true, message: "Nhập số đánh giá!" }]}
                    >
                        <InputNumber min={0} max={5} />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            { required: true, message: "Thông tin chi tiết sản phẩm!" },
                        ]}
                    >
                        <InputComponent />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>
            <h2 className="dashboard_category-title">Danh sách tất cả sản phẩm</h2>
            <div className="dashboard_category-show-product">
                {products && products.data ? (
                    <div style={{ marginTop: "20px" }}>
                        <TableComponent
                            handleDeleteMany={handleDeleteManyProducts}
                            columns={columns}
                            isLoading={isLoadingProducts}
                            data={dataTable}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setRowSelected(record._id);
                                    },
                                };
                            }}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: products.total,
                                onChange: (page, pageSize) => {
                                    setCurrentPage(page);
                                },
                            }}
                        />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xoá"
                open={isDeleteModalVisible}
                onOk={handleDeleteConfirmed}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Bạn có chắc chắn muốn xoá sản phẩm này?</p>
            </Modal>
        </div>
    );
};

export default Product;
