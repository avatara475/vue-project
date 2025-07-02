<template>
  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
      ></div>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Loading data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Table Content -->
    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" v-if="data.length">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                v-for="header in table.getHeaderGroups()[0].headers"
                :key="header.id"
                :class="[
                  'px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
                  header.column.columnDef.meta?.hiddenClass || '',
                  header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                ]"
                scope="col"
                @click="header.column.getCanSort() ? header.column.toggleSorting() : null"
              >
                <div class="flex items-center justify-between">
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span v-if="header.column.getCanSort()" class="ml-2">
                    <template v-if="header.column.getIsSorted() === 'desc'">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </template>
                    <template v-else-if="header.column.getIsSorted() === 'asc'">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </template>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 opacity-30"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <motion.tr
              v-for="row in table.getRowModel().rows"
              :whileHover="{scaleY:'1.1',scaleX:'1.01'}"
              :key="row.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="[
                  'px-4 sm:px-6 py-4 text-sm',
                  cell.column.columnDef.meta?.hiddenClass || '',
                  cell.column.columnDef.meta?.nowrap ? 'whitespace-nowrap' : '',
                  cell.column.columnDef.meta?.fontWeight ? 'font-medium' : '',
                  cell.column.columnDef.meta?.textColor || 'text-gray-500 dark:text-gray-300',
                ]"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </motion.tr>
          </tbody>
        </table>
        <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">No data available</div>
      </div>
      <!-- Pagination -->
      <div
        v-if="showPagination"
        class="bg-gray-50 dark:bg-gray-700 px-2 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 border-t border-gray-200 dark:border-gray-600"
      >
        <!-- Mobile Pagination -->
        <div class="flex-1 flex justify-between sm:hidden w-full">
          <button
            @click="$emit('prev-page')"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-sm text-gray-700 dark:text-gray-300 mx-2 self-center">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="$emit('next-page')"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <!-- Desktop Pagination -->
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
          <div class="flex items-center space-x-2">
            <p class="text-sm text-gray-700 dark:text-gray-300">Show</p>
            <select
              :value="itemsPerPage"
              @change="$emit('items-per-page-change', $event.target.value)"
              class="block w-20 pl-3 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <p class="text-sm text-gray-700 dark:text-gray-300">per page</p>
          </div>
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{
                Math.min(currentPage * itemsPerPage, totalItems)
              }}</span>
              of <span class="font-medium">{{ totalItems }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="$emit('prev-page')"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages"
                  @click="$emit('page-change', page)"
                  :class="[
                    page === currentPage
                      ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-800 dark:text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  ]"
                >
                  {{ page }}
                </button>
                <span
                  v-else-if="Math.abs(page - currentPage) === 3"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                >
                  ...
                </span>
              </template>
              <button
                @click="$emit('next-page')"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from "vue";
import { FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from "@tanstack/vue-table";
import { motion } from "motion-v";

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 20, 30, 50],
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "edit",
  "delete",
  "prev-page",
  "next-page",
  "page-change",
  "items-per-page-change",
]);

const tableColumns = computed(() => {
  const cols = props.columns.map((col) => ({
    accessorKey: col.key,
    header: col.label,
    meta: {
      hiddenClass: col.hiddenClass || "",
      nowrap: col.nowrap || false,
      fontWeight: col.fontWeight || false,
      textColor: col.textColor || "text-gray-500 dark:text-gray-300",
    },
    cell: ({ getValue, row }) => {
      if (col.format) return col.format(getValue(), row.original);
      if (col.customRender)
        return col.customRender({
          value: getValue(),
          item: row.original,
        });
      return getValue();
    },
    enableSorting: col.sortable !== false,
  }));

  // Add actions column if enabled
  if (props.showActions) {
    cols.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const buttons = [];
        if (props.showEdit) {
          buttons.push(
            h(
              "button",
              {
                class:
                  "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2 sm:mr-4",
                onClick: () => emit("edit", row.original),
              },
              "Edit"
            )
          );
        }
        if (props.showDelete) {
          buttons.push(
            h(
              "button",
              {
                class: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
                onClick: () => emit("delete", row.original.id || row.original),
              },
              "Delete"
            )
          );
        }
        return h("div", { class: "flex space-x-2" }, buttons);
      },
    });
  }

  return cols;
});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return tableColumns.value;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

const visiblePages = computed(() => {
  const maxVisiblePages = 5;
  const pages = [];
  let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > props.totalPages) {
    endPage = props.totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});
</script>
