import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import PropTypes from "prop-types";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { deleteSelectedItems } from "@/lib/utils/deleteSelectedItems";
import { iconDictionary } from "@/lib/data/IconsDictionary";

const generateColumns = ({ onViewClick, onEditClick, onDeleteClick }) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => {
        const name = row.original.name;
        return (
          <div className="flex items-center space-x-1">
            {iconDictionary[name.toLowerCase()] ? (
              <img
                src={iconDictionary[name.toLowerCase()]}
                alt={name}
                width={20}
              />
            ) : (
              <p className="text-2xl">📦</p>
            )}
            <p className="capitalize">{name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "washingPrice",
      header: "Wash Price (GHC)",
      cell: ({ row }) => {
        const prices = row.original.pricing;
        if (!prices || prices?.length === 0) return "N/A";

        return (
          <ul>
            {prices?.map((price, index) => (
              <li key={index} className="mt-1">
                {price?.branch?.name}: {price.washingPrice}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "ironingPrice",
      header: "Ironing Price (GHC)",
      cell: ({ row }) => {
        const prices = row.original.pricing;
        if (!prices || prices?.length === 0) return "N/A";

        return (
          <ul>
            {prices?.map((price, index) => (
              <li key={index} className="mt-1">
                {price?.branch?.name}: {price.ironingPrice}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "pricing",
      header: "Branch",
      filterFn: (row, id, filterValue) => {
        const prices = row.getValue(id); // `id` is "pricing"
        if (!prices || prices.length === 0) return false;
        return prices.some((price) => price?.branch?.name === filterValue);
      },
      cell: ({ row }) => {
        const prices = row.getValue("pricing");
        if (!prices || prices?.length === 0) return "none";
        return (
          <ul>
            {prices?.map((price, index) => (
              <li key={index} className="mt-1">
                {price?.branch?.name}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "addedBy",
      header: "Added By",
      cell: ({ row }) => {
        const person = row.getValue("addedBy");
        return <div className="capitalize">{person?.name}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => onViewClick(item)}>
                View Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditClick(item)}>
                Edit Item
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteClick(item?._id)}>
                Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function ItemsTable({
  onViewClick,
  onEditClick,
  onDeleteClick,
  items,
  branchesList,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { triggerUpdate } = useAppContext();
  const {
    auth: { accessToken },
  } = useAuth();

  const columns = generateColumns({ onViewClick, onEditClick, onDeleteClick });

  const table = useReactTable({
    data: items,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [selectedBranch, setSelectedBranch] = useState("Branch");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original._id);

    try {
      const { data, message } = await deleteSelectedItems(
        accessToken,
        "item",
        selectedIds
      );

      if (message) {
        console.log(message);
        setMessage(message);
      }

      if (data) {
        console.log("Data: ", data);
        setIsConfirmDialogOpen(false);
        setMessage("");
        triggerUpdate("item");
      }
    } catch (error) {
      console.log("Error deleting items: ", error);
      setMessage("Failed to delete selected items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[50rem] sm:w-full">
      <div className="flex items-center py-4 justify-between">
        <Button
          variant="destructive"
          disabled={table.getSelectedRowModel().rows.length === 0}
          onClick={handleDeleteAll}
        >
          Delete Selected
        </Button>

        {/* Confirmation Dialog */}
        <div
          className={`${
            isConfirmDialogOpen ? "block" : "hidden"
          } fixed top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md z-20`}
        >
          {/* dialog header */}
          <div>
            <h3 className="bg-danger px-5 py-2 text-white text-center rounded-t-md">
              Delete Selected Data
            </h3>
            <p className="p-5">
              {message ||
                "Are you sure you want to delete all selected data? This action cannot be undone."}
            </p>
          </div>

          {/* dialog footer */}
          <div className="p-5 flex items-center space-x-5">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setMessage("");
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <Input
            placeholder="Search names..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-48"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedBranch} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {branchesList?.map((branch, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    setSelectedBranch(branch);
                    table.getColumn("pricing")?.setFilterValue(branch);
                  }}
                >
                  {branch}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBranch("");
                  table.getColumn("pricing")?.setFilterValue(""); // Clear the filter
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Items data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

ItemsTable.propTypes = {
  onViewClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  branchesList: PropTypes.array.isRequired,
};
