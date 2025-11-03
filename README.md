# usePaginatedList

> A powerful React hook for managing client-side paginated data with filters, automatic refetching, and built-in loading states

## ✨ Features

- 🚀 **Client-Side Pagination** - Efficiently handle large datasets with automatic page management
- 🔍 **Built-in Filtering** - Seamlessly filter data with automatic refetch on filter changes
- ⚡ **Debounced Requests** - Prevent excessive API calls with configurable debounce timing (default: 500ms)
- 🎯 **TypeScript Support** - Full type inference for your fetch methods and data structures
- 🔄 **Auto-Refetch** - Automatically refetches data when page or filters change
- 💪 **Request Abortion** - Automatic cleanup and abortion of pending requests
- 🎨 **Loading & Error States** - Built-in loading and error state management
- 🛠️ **Flexible API** - Works with any paginated API endpoint
- 🔌 **Framework Agnostic** - Works with any React-based application

## 📦 Installation

```bash
npm install @mutasimalmu/use-paginated-list-query
```

or

```bash
yarn add @mutasimalmu/use-paginated-list-query
```

## 🚀 Quick Start

### With Ant Design Table

```typescript
import usePaginatedList, {
  PaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

async function fetchUsers(
  args: PaginatedListRequest
): Promise<PaginatedListResponse<User>> {
  const response = await fetch(
    `/api/users?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}

function UsersPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    totalCount,
    changePage,
  } = usePaginatedList({
    fetchMethod: fetchUsers,
    pageSize: 10,
  });

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      rowKey="id"
      pagination={{
        current: page,
        pageSize: pageSize,
        total: totalCount,
        onChange: changePage,
      }}
    />
  );
}
```

### With shadcn/ui Components

```typescript
import usePaginatedList, {
  PaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

async function fetchProducts(
  args: PaginatedListRequest
): Promise<PaginatedListResponse<Product>> {
  const response = await fetch(
    `/api/products?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}

function ProductsPage() {
  const {
    data: products,
    isLoading,
    page,
    pageSize,
    totalCount,
    changePage,
  } = usePaginatedList({
    fetchMethod: fetchProducts,
    pageSize: 20,
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

## 📚 API Reference

### Hook Signature

```typescript
function usePaginatedList<T extends FetchMethod>(props: Props<T>): PaginatedListResult
```

### Props

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `fetchMethod` | `FetchMethod` | ✅ Yes | - | Your API fetch function that returns paginated data |
| `pageSize` | `number` | ❌ No | `10` | Number of items per page |
| `debounceTime` | `number` | ❌ No | `500` | Debounce time in milliseconds for filter changes |
| `initialState` | `Partial<State>` | ❌ No | `{}` | Initial state for filters, data, page, etc. |
| `disabled` | `boolean` | ❌ No | `false` | When true, prevents automatic data fetching |
| `pathParams` | `object` | ❌ Conditional | - | Path parameters required by your fetch method (if needed) |

**Note:** The hook initializes with `filters: { searchValue: "" }` by default. You can override this using the `initialState` prop.

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T[]` | Array of fetched items |
| `isLoading` | `boolean` | Loading state indicator |
| `page` | `number` | Current page number (1-indexed) |
| `pageSize` | `number` | Number of items per page |
| `totalCount` | `number` | Total number of items across all pages |
| `filters` | `F` | Current filter values |
| `onFiltersChange` | `(filters: F) => void` | Function to update filters |
| `changePage` | `(page: number) => void` | Function to change the current page |
| `refetchData` | `() => Promise<void>` | Manually trigger a data refetch |
| `resetFilters` | `() => void` | Reset all filters to empty state |
| `error` | `unknown` | Error object if fetch failed |
| `abort` | `() => void` | Manually abort the current request |

## 🎯 Fetch Method Requirements

The package exports utility types and interfaces to help you build type-safe fetch methods. Import and use these types for proper TypeScript inference:

```typescript
import {
  PaginatedListRequest,
  FilterablePaginatedListRequest,
  PathablePaginatedListRequest,
  FilterablePathablePaginatedListRequest,
  PaginatedListResponse,
  // Or use the pre-built method types:
  FetchPaginatedListMethod,
  FetchFilterablePaginatedListMethod,
  FetchPathablePaginatedListMethod,
  FetchFilterablePathablePaginatedListMethod,
} from '@mutasimalmu/use-paginated-list-query';
```

### Basic Fetch Method (no filters, no path params)

**Using Request/Response interfaces:**
```typescript
async function fetchUsers(
  args: PaginatedListRequest
): Promise<PaginatedListResponse<User>> {
  const response = await fetch(
    `/api/users?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}
```

**Or using the pre-built method type:**
```typescript
const fetchUsers: FetchPaginatedListMethod<User> = async (args) => {
  const response = await fetch(
    `/api/users?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
};
```

### With Filters

**Using Request/Response interfaces:**
```typescript
interface ProductFilters {
  searchValue?: string;
  category?: string;
}

async function fetchProducts(
  args: FilterablePaginatedListRequest<ProductFilters>
): Promise<PaginatedListResponse<Product>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(`/api/products?${params}`, { signal: args.signal });
  return response.json();
}
```

**Or using the pre-built method type:**
```typescript
const fetchProducts: FetchFilterablePaginatedListMethod<Product, ProductFilters> = async (args) => {
  // Implementation
};
```

### With Path Parameters

**Using Request/Response interfaces:**
```typescript
interface CategoryPathParams {
  categoryId: string;
}

async function fetchCategoryProducts(
  args: PathablePaginatedListRequest<CategoryPathParams>
): Promise<PaginatedListResponse<Product>> {
  const response = await fetch(
    `/api/categories/${args.pathParams.categoryId}/products?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}
```

**Or using the pre-built method type:**
```typescript
const fetchCategoryProducts: FetchPathablePaginatedListMethod<Product, CategoryPathParams> = async (args) => {
  // Implementation
};
```

### With Both Filters and Path Parameters

**Using Request/Response interfaces:**
```typescript
interface ProductFilters {
  searchValue?: string;
  minPrice?: number;
}

interface CategoryPathParams {
  categoryId: string;
}

async function fetchCategoryProducts(
  args: FilterablePathablePaginatedListRequest<ProductFilters, CategoryPathParams>
): Promise<PaginatedListResponse<Product>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(
    `/api/categories/${args.pathParams.categoryId}/products?${params}`,
    { signal: args.signal }
  );
  return response.json();
}
```

**Or using the pre-built method type:**
```typescript
const fetchCategoryProducts: FetchFilterablePathablePaginatedListMethod<
  Product,
  ProductFilters,
  CategoryPathParams
> = async (args) => {
  // Implementation
};
```

**✨ Benefits of using these types:**
- ✅ Full TypeScript inference throughout your application
- ✅ Compile-time type checking for request/response structures
- ✅ Better IDE autocomplete and IntelliSense
- ✅ Prevents common typing mistakes

**Note:** The hook automatically detects which parameters your fetch method expects and passes them accordingly.

### Example Fetch Method with Error Handling

```typescript
import {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';

interface ProductFilters {
  searchValue?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

async function fetchProducts(
  args: FilterablePaginatedListRequest<ProductFilters>
): Promise<PaginatedListResponse<Product>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });

  const response = await fetch(`/api/products?${params}`, {
    signal: args.signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}
```

## 💡 Advanced Usage Examples

### With Filters (Ant Design)

```typescript
import usePaginatedList, {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table, Input, Select, Button, Space } from 'antd';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ProductFilters {
  searchValue?: string;
  category?: string;
}

async function fetchProducts(
  args: FilterablePaginatedListRequest<ProductFilters>
): Promise<PaginatedListResponse<Product>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(`/api/products?${params}`, { signal: args.signal });
  return response.json();
}

function ProductsPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    totalCount,
    filters,
    onFiltersChange,
    changePage,
    resetFilters,
  } = usePaginatedList({
    fetchMethod: fetchProducts,
    pageSize: 25,
    initialState: {
      filters: {
        category: 'electronics',
      },
    },
  });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `$${price}` },
    { title: 'Category', dataIndex: 'category', key: 'category' },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search products..."
          value={filters.searchValue}
          onChange={(e) => onFiltersChange({ searchValue: e.target.value })}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Select category"
          value={filters.category}
          onChange={(value) => onFiltersChange({ category: value })}
          style={{ width: 150 }}
        >
          <Select.Option value="electronics">Electronics</Select.Option>
          <Select.Option value="clothing">Clothing</Select.Option>
          <Select.Option value="books">Books</Select.Option>
        </Select>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalCount,
          onChange: changePage,
        }}
      />
    </div>
  );
}
```

### With Filters (shadcn/ui)

```typescript
import usePaginatedList, {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  status: string;
}

interface ArticleFilters {
  searchValue?: string;
  status?: string;
}

async function fetchArticles(
  args: FilterablePaginatedListRequest<ArticleFilters>
): Promise<PaginatedListResponse<Article>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(`/api/articles?${params}`, { signal: args.signal });
  return response.json();
}

function ArticlesPage() {
  const {
    data: articles,
    isLoading,
    page,
    pageSize,
    totalCount,
    filters,
    onFiltersChange,
    changePage,
    resetFilters,
  } = usePaginatedList({
    fetchMethod: fetchArticles,
    pageSize: 12,
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search articles..."
          value={filters.searchValue || ''}
          onChange={(e) => onFiltersChange({ searchValue: e.target.value })}
          className="max-w-sm"
        />
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="flex items-center px-4">
          Page {page} of {Math.ceil(totalCount / pageSize)}
        </span>
        <Button
          variant="outline"
          onClick={() => changePage(page + 1)}
          disabled={page === Math.ceil(totalCount / pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

### With Path Parameters

```typescript
import usePaginatedList, {
  PathablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table, Tag } from 'antd';

interface CategoryPathParams {
  categoryId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

async function fetchProductsByCategory(
  args: PathablePaginatedListRequest<CategoryPathParams>
): Promise<PaginatedListResponse<Product>> {
  const response = await fetch(
    `/api/categories/${args.pathParams.categoryId}/products?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}

function CategoryProductsPage({ categoryId }: { categoryId: string }) {
  const {
    data: products,
    isLoading,
    page,
    pageSize,
    totalCount,
    changePage,
  } = usePaginatedList({
    fetchMethod: fetchProductsByCategory,
    pathParams: { categoryId },
    pageSize: 20,
  });

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock) => (
        <Tag color={inStock ? 'green' : 'red'}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2>Products ({totalCount} total)</h2>
      <Table
        columns={columns}
        dataSource={products}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalCount,
          onChange: changePage,
        }}
      />
    </div>
  );
}
```

### Custom Debounce Time

```typescript
import usePaginatedList, {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Input, List, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface UserFilters {
  searchValue?: string;
}

async function fetchUsers(
  args: FilterablePaginatedListRequest<UserFilters>
): Promise<PaginatedListResponse<User>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(`/api/users?${params}`, { signal: args.signal });
  return response.json();
}

function UserSearchPage() {
  const {
    data: users,
    isLoading,
    onFiltersChange,
  } = usePaginatedList({
    fetchMethod: fetchUsers,
    debounceTime: 300, // Faster response for search (default is 500ms)
    pageSize: 15,
  });

  return (
    <div>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search users..."
        onChange={(e) => onFiltersChange({ searchValue: e.target.value })}
        style={{ marginBottom: 16 }}
        size="large"
      />
      <List
        loading={isLoading}
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={user.avatar} />}
              title={user.name}
              description={user.email}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
```

### Manual Refetch

```typescript
import usePaginatedList, {
  PaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
}

async function fetchOrders(
  args: PaginatedListRequest
): Promise<PaginatedListResponse<Order>> {
  const response = await fetch(
    `/api/orders?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}

function OrdersTable() {
  const {
    data: orders,
    isLoading,
    page,
    pageSize,
    totalCount,
    changePage,
    refetchData,
  } = usePaginatedList({
    fetchMethod: fetchOrders,
    pageSize: 10,
  });

  const handleRefresh = async () => {
    await refetchData();
    message.success('Data refreshed successfully!');
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total) => `$${total}` },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          Refresh Data
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalCount,
          onChange: changePage,
        }}
      />
    </div>
  );
}
```

### Disabled State

```typescript
import usePaginatedList, {
  PaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table, Switch, Alert } from 'antd';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

async function fetchProducts(
  args: PaginatedListRequest
): Promise<PaginatedListResponse<Product>> {
  const response = await fetch(
    `/api/products?page=${args.page}&page_size=${args.page_size}`,
    { signal: args.signal }
  );
  return response.json();
}

function ConditionalProductsTable() {
  const [enabled, setEnabled] = useState(false);

  const {
    data: products,
    isLoading,
    page,
    pageSize,
    totalCount,
    changePage,
  } = usePaginatedList({
    fetchMethod: fetchProducts,
    disabled: !enabled, // Only fetch when enabled
    pageSize: 10,
  });

  const columns = [
    { title: 'Product', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
        <span style={{ marginLeft: 8 }}>Toggle data fetching</span>
      </div>

      {!enabled ? (
        <Alert
          message="Data fetching is disabled"
          description="Enable the switch above to start fetching data."
          type="info"
        />
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalCount,
            onChange: changePage,
          }}
        />
      )}
    </div>
  );
}
```

### Complete Example with All Features (Ant Design)

```typescript
import usePaginatedList, {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table, Input, Select, Button, Space, Tag, message, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserFilters {
  searchValue?: string;
  role?: string;
  status?: string;
}

async function fetchUsers(
  args: FilterablePaginatedListRequest<UserFilters>
): Promise<PaginatedListResponse<User>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...(args.filters.searchValue && { search: args.filters.searchValue }),
    ...(args.filters.role && { role: args.filters.role }),
    ...(args.filters.status && { status: args.filters.status }),
  });

  const response = await fetch(`/api/users?${params}`, { signal: args.signal });
  return response.json();
}

function UsersManagementPage() {
  const {
    data: users,
    isLoading,
    page,
    pageSize,
    totalCount,
    filters,
    onFiltersChange,
    changePage,
    refetchData,
    resetFilters,
    error,
  } = usePaginatedList({
    fetchMethod: fetchUsers,
    pageSize: 20,
    debounceTime: 400,
    initialState: {
      filters: {
        status: 'active',
      },
    },
  });

  const handleRefresh = async () => {
    await refetchData();
    message.success('Data refreshed!');
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Error Loading Users"
        description="Failed to load users. Please try again."
        type="error"
        showIcon
        action={
          <Button size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Users Management</h1>
      
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search users..."
            value={filters.searchValue || ''}
            onChange={(e) => onFiltersChange({ searchValue: e.target.value })}
            style={{ width: 250 }}
            allowClear
          />
          
          <Select
            placeholder="Filter by role"
            value={filters.role}
            onChange={(value) => onFiltersChange({ role: value })}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="moderator">Moderator</Select.Option>
          </Select>

          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => onFiltersChange({ status: value })}
            style={{ width: 150 }}
          >
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>

          <Button
            icon={<ClearOutlined />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isLoading}
          >
            Refresh
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalCount,
          onChange: changePage,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} users`,
        }}
      />
    </div>
  );
}
```

## 🔧 TypeScript

The hook provides full type inference when you use the exported utility types. **Always import and use these types for the best TypeScript experience:**

```typescript
import usePaginatedList, {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';

// Define your data types
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFilters {
  role?: string;
  status?: string;
  searchValue?: string;
}

// ✅ CORRECT: Your fetch method using exported types
const fetchUsers = async (
  args: FilterablePaginatedListRequest<UserFilters>
): Promise<PaginatedListResponse<User>> => {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(`/api/users?${params}`, { signal: args.signal });
  return response.json();
};

// Hook automatically infers types correctly
const {
  data, // ✅ Type: User[]
  filters, // ✅ Type: UserFilters
  onFiltersChange, // ✅ Type: (filters: UserFilters) => void
} = usePaginatedList({
  fetchMethod: fetchUsers,
});
```

### ❌ Common Mistake - Don't Do This:

```typescript
// ❌ BAD: Writing types manually without imports
const fetchUsers = async (args: {
  page: number;
  page_size: number;
  filters?: UserFilters;
  signal?: AbortSignal;
}): Promise<{
  results: User[];
  count: number;
  next: string | null;
  previous: string | null;
}> => {
  // This works but you lose type inference benefits
  // and won't get compiler errors if the API changes
};
```

### ✅ Best Practice - Use Exported Types:

```typescript
import {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';

// ✅ GOOD: Using exported types ensures:
// - Full type inference
// - Type safety
// - IDE autocomplete
// - Compile-time error detection
const fetchUsers = async (
  args: FilterablePaginatedListRequest<UserFilters>
): Promise<PaginatedListResponse<User>> => {
  // Implementation
};
```

## 🎨 Best Practices

### 1. Keep Fetch Methods Pure

```typescript
// ✅ Good - Pure function
const fetchProducts = async (args) => {
  return api.get('/products', { params: args });
};

// ❌ Bad - Side effects in fetch method
const fetchProducts = async (args) => {
  showLoadingToast(); // Side effect
  return api.get('/products', { params: args });
};
```

### 2. Use Proper Filter Types

```typescript
// ✅ Good - Explicit filter types
interface ProductFilters {
  searchValue?: string;
  category?: string;
  status?: 'available' | 'out_of_stock';
  minPrice?: number;
  maxPrice?: number;
}

// ❌ Bad - Any type
type ProductFilters = any;
```

### 3. Handle Errors Gracefully (with Ant Design)

```typescript
import { Alert, Spin } from 'antd';

const { data, error, isLoading } = usePaginatedList({
  fetchMethod: fetchProducts,
});

if (error) {
  return (
    <Alert
      message="Error"
      description="Failed to load data. Please try again."
      type="error"
      showIcon
    />
  );
}

if (isLoading) {
  return <Spin size="large" />;
}

return <Table dataSource={data} columns={columns} />;
```

### 3b. Handle Errors Gracefully (with shadcn/ui)

```typescript
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const { data, error, isLoading } = usePaginatedList({
  fetchMethod: fetchProducts,
});

if (error) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load data. Please try again.
      </AlertDescription>
    </Alert>
  );
}

if (isLoading) {
  return <div>Loading...</div>;
}

return <Table dataSource={data} columns={columns} />;
```

### 4. Reset to Page 1 When Filters Change

The hook automatically handles this! When filters change, it maintains the current page. If you want to reset to page 1, do it manually:

```typescript
const { onFiltersChange, changePage } = usePaginatedList({
  fetchMethod: fetchData,
});

const handleFilterChange = (newFilters) => {
  changePage(1); // Reset to first page
  onFiltersChange(newFilters);
};
```

## 🔍 How It Works

1. **Initialization**: Hook initializes with default or provided initial state
2. **Auto-Fetch**: Automatically fetches data when mounted
3. **Filter Changes**: When filters change, debounced fetch is triggered
4. **Page Changes**: When page changes, immediate fetch is triggered
5. **Request Abortion**: Previous requests are aborted when new requests start
6. **State Updates**: Loading, data, and error states are updated accordingly
7. **Cleanup**: Aborts pending requests on unmount

## 🚦 Common Patterns

### Pagination Controls

```typescript
function PaginationControls({ page, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div>
      <button 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1}
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
```

### Search with Debounce (Ant Design)

```typescript
import usePaginatedList, {
  FilterablePaginatedListRequest,
  PaginatedListResponse,
} from '@mutasimalmu/use-paginated-list-query';
import { Table, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ProductFilters {
  searchValue?: string;
}

async function fetchProducts(
  args: FilterablePaginatedListRequest<ProductFilters>
): Promise<PaginatedListResponse<Product>> {
  const params = new URLSearchParams({
    page: args.page.toString(),
    page_size: args.page_size.toString(),
    ...args.filters,
  });
  const response = await fetch(`/api/products?${params}`, { signal: args.signal });
  return response.json();
}

function SearchableProductsTable() {
  const {
    data: products,
    filters,
    onFiltersChange,
    isLoading,
    page,
    pageSize,
    totalCount,
    changePage,
  } = usePaginatedList({
    fetchMethod: fetchProducts,
    debounceTime: 500, // Wait 500ms after user stops typing
    pageSize: 10,
  });

  const columns = [
    { title: 'Product', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search products..."
        value={filters.searchValue || ''}
        onChange={(e) => onFiltersChange({ searchValue: e.target.value })}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={products}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalCount,
          onChange: changePage,
        }}
      />
    </Space>
  );
}
```

## 🐛 Troubleshooting

### Data not fetching?
- Check that `disabled` prop is not set to `true`
- Verify your fetch method signature matches the required format
- Check network tab for API errors

### Too many requests?
- Increase `debounceTime` for filter-heavy UIs
- Ensure you're not calling `onFiltersChange` unnecessarily

### TypeScript errors?
- Ensure your fetch method has proper return type annotations
- Check that your filter types are correctly defined

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Keywords:** React hook, pagination, client-side pagination, data fetching, filters, TypeScript, debounce, loading states, abort controller, React Query alternative

