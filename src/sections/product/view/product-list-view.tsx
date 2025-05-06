// 'use client';

// import isEqual from 'lodash/isEqual';
// import { useState, useEffect, useCallback } from 'react';

// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import {
//   DataGrid,
//   GridColDef,
//   GridToolbarExport,
//   GridActionsCellItem,
//   GridToolbarContainer,
//   GridRowSelectionModel,
//   GridToolbarQuickFilter,
//   GridToolbarFilterButton,
//   GridToolbarColumnsButton,
//   GridColumnVisibilityModel,
// } from '@mui/x-data-grid';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

// import { useBoolean } from 'src/hooks/use-boolean';

// import { useGetProducts } from 'src/api/product';
// import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';

// import Iconify from 'src/components/iconify';
// import { useSnackbar } from 'src/components/snackbar';
// import EmptyContent from 'src/components/empty-content';
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
// import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// import { IProductItem, IProductTableFilters, IProductTableFilterValue } from 'src/types/product';

// import ProductTableToolbar from '../product-table-toolbar';
// import ProductTableFiltersResult from '../product-table-filters-result';
// import {
//   RenderCellStock,
//   RenderCellPrice,
//   RenderCellPublish,
//   RenderCellProduct,
//   RenderCellCreatedAt,
// } from '../product-table-row';
// import { borderRadius } from '@mui/system';
// import axios from 'axios';
// import { HOST_API } from 'src/config-global';
// import { endpoints } from 'src/utils/axios';

// // ----------------------------------------------------------------------

// const PUBLISH_OPTIONS = [
//   { value: 'published', label: 'Published' },
//   { value: 'draft', label: 'Draft' },
// ];

// const defaultFilters: IProductTableFilters = {
//   publish: [],
//   stock: [],
// };

// const HIDE_COLUMNS = {
//   category: false,
// };

// const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// // ----------------------------------------------------------------------

// export default function ProductListView() {
//   const { enqueueSnackbar } = useSnackbar();

//   const confirmRows = useBoolean();

//   const router = useRouter();

//   const settings = useSettingsContext();

//   const { products, productsLoading } = useGetProducts();

//   const [tableData, setTableData] = useState<IProductItem[]>([]);

//   const [filters, setFilters] = useState(defaultFilters);

//   const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

//   const [columnVisibilityModel, setColumnVisibilityModel] =
//     useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

//   useEffect(() => {
//     if (products.length) {
//       setTableData(products);
//     }
//   }, [products]);

//   const dataFiltered = applyFilter({
//     inputData: tableData,
//     filters,
//   });

//   const canReset = !isEqual(defaultFilters, filters);

//   const handleFilters = useCallback((name: string, value: IProductTableFilterValue) => {
//     setFilters((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   }, []);

//   const handleResetFilters = useCallback(() => {
//     setFilters(defaultFilters);
//   }, []);

//   const handleDeleteRow = useCallback(
//     (id: string) => {
//       const deleteRow = tableData.filter((row) => row.id !== id);

//       enqueueSnackbar('Delete success!');

//       setTableData(deleteRow);
//     },
//     [enqueueSnackbar, tableData]
//   );

//   const handleDeleteRows = useCallback(async () => {
//     const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));
//     // const response = await axios.post(`${HOST_API}${endpoints.deleteExistingFile}` , {id:});


//     enqueueSnackbar('Delete success!');

//     setTableData(deleteRows);
//   }, [enqueueSnackbar, selectedRowIds, tableData]);

//   const handleEditRow = useCallback(
//     (id: string) => {
//       router.push(paths.dashboard.product.edit(id));
//     },
//     [router]
//   );

//   const handleViewRow = useCallback(
//     (id: string) => {
//       router.push(paths.dashboard.product.details(id));
//     },
//     [router]
//   );

//   const columns: GridColDef[] = [
//     {
//       field: 'category',
//       headerName: 'Category',
//       filterable: false,
//     },
//     {
//       field: 'name',
//       headerName: 'Product',
//       flex: 1,
//       minWidth: 360,
//       hideable: false,
//       renderCell: (params) => <RenderCellProduct params={params} />,
//     },
//     {
//       field: 'createdAt',
//       headerName: 'Create at',
//       width: 160,
//       renderCell: (params) => <RenderCellCreatedAt params={params} />,
//     },
//     // {
//     //   field: 'inventoryType',
//     //   headerName: 'Stock',
//     //   width: 160,
//     //   type: 'singleSelect',
//     //   valueOptions: PRODUCT_STOCK_OPTIONS,
//     //   renderCell: (params) => <RenderCellStock params={params} />,
//     // },
//     {
//       field: 'price',
//       headerName: 'Price',
//       width: 140,
//       editable: true,
//       renderCell: (params) => <RenderCellPrice params={params} />,
//     },
//     {
//       field: 'publish',
//       headerName: 'Publish',
//       width: 110,
//       type: 'singleSelect',
//       editable: true,
//       valueOptions: PUBLISH_OPTIONS,
//       renderCell: (params) => <RenderCellPublish params={params} />,
//     },
//     {
//       type: 'actions',
//       field: 'actions',
//       headerName: ' ',
//       align: 'right',
//       headerAlign: 'right',
//       width: 80,
//       sortable: false,
//       filterable: false,
//       disableColumnMenu: true,
//       getActions: (params) => [
//         <GridActionsCellItem
//           showInMenu
//           icon={<Iconify icon="solar:eye-bold" />}
//           label="View"
//           onClick={() => handleViewRow(params.row.id)}
//         />,
//         <GridActionsCellItem
//           showInMenu
//           icon={<Iconify icon="solar:pen-bold" />}
//           label="Edit"
//           onClick={() => handleEditRow(params.row.id)}
//         />,
//         <GridActionsCellItem
//           showInMenu
//           icon={<Iconify icon="solar:trash-bin-trash-bold" />}
//           label="Delete"
//           onClick={() => {
//             handleDeleteRow(params.row.id);
//           }}
//           sx={{ color: 'error.main' }}
//         />,
//       ],
//     },
//   ];

//   const getTogglableColumns = () =>
//     columns
//       .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
//       .map((column) => column.field);

//   return (
//     <>
//       <Container
//         maxWidth={settings.themeStretch ? false : 'lg'}
//         sx={{
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <CustomBreadcrumbs
//           heading="List"
//           links={[
//             { name: 'Dashboard', href: paths.dashboard.root },
//             {
//               name: 'Product',
//               href: paths.dashboard.product.root,
//             },
//             { name: 'List' },
//           ]}
//           action={
//             <Button
//               style={{ borderRadius: 0, }}
//               color='success'
//               component={RouterLink}
//               href={paths.dashboard.product.new}
//               variant="contained"
//               startIcon={<Iconify icon="mingcute:add-line" />}
//             >
//               New Product
//             </Button>
//           }
//           sx={{
//             mb: {
//               xs: 3,
//               md: 5,
//             },
//           }}
//         />

//         <Card

//           sx={{
//             borderRadius: { xs: 0, md: 0 },
//             height: { xs: 800, md: 2 },
//             flexGrow: { md: 1 },
//             display: { md: 'flex' },
//             flexDirection: { md: 'column' },
//           }}
//         >
//           <DataGrid
//             checkboxSelection
//             disableRowSelectionOnClick
//             rows={dataFiltered}
//             columns={columns}
//             loading={productsLoading}
//             getRowHeight={() => 'auto'}
//             pageSizeOptions={[5, 10, 25]}
//             getRowId={(row) => row._id}
//             initialState={{
//               pagination: {
//                 paginationModel: { pageSize: 10 },
//               },
//             }}
//             onRowSelectionModelChange={(newSelectionModel) => {
//               setSelectedRowIds(newSelectionModel);
//             }}
//             columnVisibilityModel={columnVisibilityModel}
//             onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
//             slots={{
//               toolbar: () => (
//                 <>

//                   {canReset && (
//                     <ProductTableFiltersResult
//                       filters={filters}
//                       onFilters={handleFilters}
//                       onResetFilters={handleResetFilters}
//                       results={dataFiltered.length}
//                       sx={{ p: 2.5, pt: 0 }}
//                     />
//                   )}
//                 </>
//               ),
//               noRowsOverlay: () => <EmptyContent title="No Data" />,
//               noResultsOverlay: () => <EmptyContent title="No results found" />,
//             }}
//             slotProps={{
//               columnsPanel: {
//                 getTogglableColumns,
//               },
//             }}
//           />
//         </Card>
//       </Container>

//       <ConfirmDialog
//         open={confirmRows.value}
//         onClose={confirmRows.onFalse}
//         title="Delete"
//         content={
//           <>
//             Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
//           </>
//         }
//         action={
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               handleDeleteRows();
//               confirmRows.onFalse();
//             }}
//           >
//             Delete
//           </Button>
//         }
//       />
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter({
//   inputData,
//   filters,
// }: {
//   inputData: IProductItem[];
//   filters: IProductTableFilters;
// }) {
//   const { stock, publish } = filters;

//   if (stock.length) {
//     inputData = inputData.filter((product) => stock.includes(product.inventoryType));
//   }

//   if (publish.length) {
//     inputData = inputData.filter((product) => publish.includes(product.publish));
//   }

//   return inputData;
// }



'use client';

import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';

import { IFile, IFileFilters, IFileFilterValue } from 'src/types/file';

// import FileManagerTable from ' ../file-manager-table';
import FileManagerTable from '../../file-manager/file-manager-table';
import FileManagerFilters from '../../file-manager/file-manager-filters';
import FileManagerGridView from '../../file-manager/file-manager-grid-view';
import FileManagerFiltersResult from '../../file-manager/file-manager-filters-result';
import FileManagerNewFolderDialog from '../../file-manager/file-manager-new-folder-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useGetFileProducts, } from 'src/api/product';
import { IProductItem } from 'src/types/product';
import { endpoints } from 'src/utils/axios';
import { HOST_API } from 'src/config-global';
import axios from 'axios';
import ProductManagerTable from './product-manager-table';

// ----------------------------------------------------------------------

const defaultFilters: IFileFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [view, setView] = useState('list');

  const { products, productsLoading } = useGetFileProducts();


  // const [tableData, setTableData] = useState<IFile[]>(_allFiles);
  const [tableData, setTableData] = useState<IFile[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);


  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleFilters = useCallback(
    (name: string, value: IFileFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteItem = useCallback(
    async (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      const response = await axios.post(`${HOST_API}${endpoints.deleteExistingFile}`, { id: id });
      enqueueSnackbar(response.data.message);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />

      {/* <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup> */}
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 1, md: 2 },
          }}
        >
          {/* <Typography variant="h4">File Manager</Typography> */}
          <CustomBreadcrumbs
            heading="List"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'All Product List' },
            ]}
            // action={
            //   <Button
            //     style={{ borderRadius: 0, }}
            //     color='success'
            //     component={RouterLink}
            //     href={paths.dashboard.admin.product.new}
            //     variant="contained"
            //     startIcon={<Iconify icon="mingcute:add-line" />}
            //   >
            //     New Product
            //   </Button>
            // }
            sx={{
              mb: {
                xs: 0, md: 0,
              },
            }}
          />
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 1, md: 1 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            {view !== 'list' ? (
              <ProductManagerTable  
                table={table}
                dataFiltered={dataFiltered}
                onDeleteRow={handleDeleteItem}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
              />
            ) : (
              <FileManagerGridView
                table={table}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
              />
            )}
          </>
        )}
      </Container>

      {/* <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} /> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IFile[];
  comparator: (a: any, b: any) => number;
  filters: IFileFilters;
  dateError: boolean;
}) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (type.length) {
  //   inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => isBetween(file.modifiedAt, startDate, endDate));
    }
  }

  return inputData;
}
