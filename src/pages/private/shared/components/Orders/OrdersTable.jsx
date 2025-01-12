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
import { ordersData } from "@/lib/data/ordersData";
import PropTypes from "prop-types";
import { iconDictionary } from "@/lib/data/IconsDictionary";

const data = ordersData?.reverse();

const generateColumns = ({ onViewClick, onEditClick }) => {
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
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => (
        <p className="capitalize">{row.getValue("customerName")}</p>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.getValue("items");
        const uniques = [];
        for (let i of items) {
          if (!uniques.includes(i)) uniques.push(i);
        }
        return (
          <div className="flex items-center">
            {uniques?.map((item, index) => (
              <img
                key={index}
                src={iconDictionary[item]}
                alt={item}
                width={20}
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "dateCreated",
      header: "Order Date",
      cell: ({ row }) => <p>{row.getValue("dateCreated")}</p>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <p className="">{row.getValue("quantity")}</p>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.getValue("status");
        return (
          <div
            className={`capitalize w-fit py-2 px-3 rounded-md ${
              value === "delivered"
                ? "text-gray-600 bg-gray-400/40"
                : "text-danger bg-danger/20"
            }`}
          >
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "attendedBy",
      header: "Attended By",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("attendedBy")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const Order = row.original;

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

              <DropdownMenuItem onClick={() => onViewClick(Order?.id)}>
                View Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditClick(Order?.id)}>
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => alert("Deleting Order: " + Order?.id)}
              >
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export function OrdersTable({ onViewClick, onEditClick }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = generateColumns({ onViewClick, onEditClick });

  const table = useReactTable({
    data,
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

  const [selectedStatus, setSelectedStatus] = useState("Status");

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <div>...</div>
        <div className="flex items-center space-x-5">
          <Input
            placeholder="Search customers..."
            value={table.getColumn("customerName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table
                .getColumn("customerName")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-48"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedStatus} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Canceled", "Delivered"]?.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    table.getColumn("status")?.setFilterValue(status);
                  }}
                >
                  {status}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStatus("Status");
                  table.getColumn("status")?.setFilterValue(""); // Clear the filter to show all staff
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
                  No results.
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

OrdersTable.propTypes = {
  onViewClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
