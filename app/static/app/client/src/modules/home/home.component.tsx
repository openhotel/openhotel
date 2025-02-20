import React, { useCallback, useEffect } from "react";
//@ts-ignore
import styles from "./home.module.scss";
import { useFiles } from "shared/hooks/index.ts";
import {
  TableComponent,
  ButtonComponent,
  FileInputComponent,
} from "@oh/components";
import { cn } from "shared/utils/class-name.utils.ts";
import dayjs from "dayjs";

export const HomeComponent: React.FC = () => {
  const { files, getList, uploadFile, deleteFile } = useFiles();

  useEffect(() => {
    getList();
  }, [getList]);

  const onUploadFile = useCallback(
    async ([file]) => {
      const formData = new FormData();
      formData.append("file", file);

      await uploadFile(formData);
    },
    [uploadFile],
  );

  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <FileInputComponent onChange={onUploadFile} accept="image/*" />
        <TableComponent
          title="Files"
          searchable={true}
          pageRows={20}
          rowFunc={($row, columns) => {
            return (
              <tr
                key={$row.id + "row"}
                className={cn(styles.row, {
                  [styles.selected]: false,
                })}
              >
                {columns.map(($column) => {
                  let value = $row[$column.key];

                  if ($column.key === "actions") {
                    value = (
                      <>
                        <ButtonComponent
                          color="grey"
                          onClick={deleteFile($row.id)}
                        >
                          Delete
                        </ButtonComponent>
                      </>
                    );
                  }

                  return (
                    <td
                      title={value}
                      key={$row.id + $column.key + "row-column"}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          }}
          data={files.map((file) => ({
            ...file,
            createdAt: dayjs(file.createdAt).format("YYYY/MM/DD HH:mm:ss"),
          }))}
          columns={[
            {
              key: "id",
              label: "ID",
            },
            {
              sortable: true,
              key: "name",
              label: "Name",
            },
            {
              sortable: true,
              key: "createdAt",
              label: "Created At",
            },
            {
              key: "actions",
              label: "Actions",
            },
          ]}
        />
      </div>
    </div>
  );
};
