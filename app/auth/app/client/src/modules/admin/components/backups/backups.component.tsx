import { useAdmin } from "shared/hooks";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import {
  ButtonComponent,
  ConfirmationModalComponent,
  TableComponent,
} from "@oh/components";
import { Backup } from "shared/types";
import { useModal } from "@oh/components";

//@ts-ignore
import styles from "./backups.module.scss";

export const AdminBackupsComponent = () => {
  const { fetchBackups, backups, backup, deleteBackup } = useAdmin();
  const { open, close } = useModal();

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  return (
    <div>
      <h2>Backups</h2>
      <div className={styles.users}>
        <div>
          <ButtonComponent
            color="yellow"
            variant="3d"
            onClick={() => backup("_manual")}
          >
            Backup now!
          </ButtonComponent>
        </div>
        <TableComponent
          title="Backups"
          searchable={true}
          pageRows={20}
          data={backups
            .sort((backupA, backupB) => backupB.modifiedAt - backupA.modifiedAt)
            .map((backup) => ({
              ...backup,
              id: backup.name,
              modifiedAt: dayjs(backup.modifiedAt).format(
                "YYYY/MM/DD HH:mm:ss",
              ),
              size: `${backup.size}kB`,
            }))}
          rowFunc={($row: Backup & { id: string }, columns) => {
            return (
              <tr key={$row.id + "row"}>
                {columns.map(($column) => {
                  if ($column.key === "__actions")
                    return (
                      <td
                        title={$column.label}
                        key={$row.id + $column.key + "row-column"}
                      >
                        <ButtonComponent
                          color="grey"
                          onClick={() =>
                            open({
                              children: (
                                <ConfirmationModalComponent
                                  description={`Are you sure you want to delete the backup '${$row.name}'?`}
                                  onClose={close}
                                  onConfirm={() => deleteBackup($row.name)}
                                />
                              ),
                            })
                          }
                        >
                          Delete
                        </ButtonComponent>
                      </td>
                    );

                  return (
                    <td
                      title={$column.label}
                      key={$row.id + $column.key + "row-column"}
                    >
                      {$row[$column.key]}
                    </td>
                  );
                })}
              </tr>
            );
          }}
          columns={[
            {
              key: "name",
              label: "Name",
            },
            {
              sortable: true,
              key: "modifiedAt",
              label: "Modified At",
            },
            {
              key: "size",
              label: "Size",
            },
            {
              key: "__actions",
              label: "Actions",
            },
          ]}
        />
      </div>
    </div>
  );
};
