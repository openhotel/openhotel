import { fn } from "@storybook/test";
import { TableComponent } from "./table.component";
import * as React from "react";

export default {
  title: "Components/Form/Table",
  component: TableComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { data: fn(), onError: fn() },
};

export const Primary = {
  args: {
    rowFunc: ($row, columns) => {
      if ($row.name !== "Pablo") return null;

      return (
        <tr key={$row.id + "row"}>
          {columns.map(($column) => (
            <td
              key={$row.id + $column.key + "row-column"}
              style={{
                backgroundColor: "yellow",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {$row[$column.key]}
            </td>
          ))}
        </tr>
      );
    },
    columns: [
      {
        key: "name",
        label: "Name",
      },
      {
        sortable: true,
        key: "username",
        label: "Username",
      },
      {
        key: "email",
        label: "Email",
      },
    ],
    data: [
      {
        id: 1,
        name: "Pablo",
        username: "pagoru",
        email: "pagoru@example.com",
      },
      {
        id: 2,
        name: "Wacede",
        username: "alqubo",
        email: "alqubo@example.com",
      },
      {
        id: 3,
        name: "Fake123",
        username: "fake123",
        email: "fake123@aol.com",
      },
    ],
  },
};

export const Secondary = {
  args: {
    title: "Users",
    searchable: true,
    pageRows: 10,
    columns: [
      {
        sortable: true,
        key: "name",
        label: "Name",
      },
      {
        key: "username",
        label: "Username",
      },
      {
        sortable: true,
        key: "email",
        label: "Email",
      },
    ],
    data: [
      {
        id: "4d5e6f7g8h9i0j1a2b3c",
        name: "Alpha001",
        username: "alpha001",
        email: "alpha001@outlook.com",
      },
      {
        id: "5e6f7g8h9i0j1a2b3c4d",
        name: "Beta002",
        username: "beta002",
        email: "beta002@hotmail.com",
      },
      {
        id: "6f7g8h9i0j1a2b3c4d5e",
        name: "Gamma003",
        username: "gamma003",
        email: "gamma003@mail.com",
      },
      {
        id: "7g8h9i0j1a2b3c4d5e6f",
        name: "Delta004",
        username: "delta004",
        email: "delta004@example.com",
      },
      {
        id: "8h9i0j1a2b3c4d5e6f7g",
        name: "Epsilon005",
        username: "epsilon005",
        email: "epsilon005@live.com",
      },
      {
        id: "9i0j1a2b3c4d5e6f7g8h",
        name: "Zeta006",
        username: "zeta006",
        email: "zeta006@icloud.com",
      },
      {
        id: "0j1a2b3c4d5e6f7g8h9i",
        name: "Eta007",
        username: "eta007",
        email: "eta007@protonmail.com",
      },
      {
        id: "1b2c3d4e5f6g7h8i9j0k",
        name: "Theta008",
        username: "theta008",
        email: "theta008@zoho.com",
      },
      {
        id: "2c3d4e5f6g7h8i9j0k1b",
        name: "Iota009",
        username: "iota009",
        email: "iota009@gmx.com",
      },
      {
        id: "3d4e5f6g7h8i9j0k1b2c",
        name: "Kappa010",
        username: "kappa010",
        email: "kappa010@yandex.com",
      },
      {
        id: "4e5f6g7h8i9j0k1b2c3d",
        name: "Lambda011",
        username: "lambda011",
        email: "lambda011@me.com",
      },
      {
        id: "5f6g7h8i9j0k1b2c3d4e",
        name: "Mu012",
        username: "mu012",
        email: "mu012@hushmail.com",
      },
      {
        id: "6g7h8i9j0k1b2c3d4e5f",
        name: "Nu013",
        username: "nu013",
        email: "nu013@fastmail.com",
      },
      {
        id: "7h8i9j0k1b2c3d4e5f6g",
        name: "Xi014",
        username: "xi014",
        email: "xi014@mailinator.com",
      },
      {
        id: "8i9j0k1b2c3d4e5f6g7h",
        name: "Omicron015",
        username: "omicron015",
        email: "omicron015@aol.com",
      },
      {
        id: "9j0k1b2c3d4e5f6g7h8i",
        name: "Pi016",
        username: "pi016",
        email: "pi016@yahoo.com",
      },
      {
        id: "0k1b2c3d4e5f6g7h8i9j",
        name: "Rho017",
        username: "rho017",
        email: "rho017@gmail.com",
      },
      {
        id: "1c2d3e4f5g6h7i8j9k0b",
        name: "Sigma018",
        username: "sigma018",
        email: "sigma018@outlook.com",
      },
      {
        id: "2d3e4f5g6h7i8j9k0b1c",
        name: "Tau019",
        username: "tau019",
        email: "tau019@hotmail.com",
      },
      {
        id: "3e4f5g6h7i8j9k0b1c2d",
        name: "Upsilon020",
        username: "upsilon020",
        email: "upsilon020@mail.com",
      },
      {
        id: "4f5g6h7i8j9k0b1c2d3e",
        name: "Phi021",
        username: "phi021",
        email: "phi021@example.com",
      },
      {
        id: "5g6h7i8j9k0b1c2d3e4f",
        name: "Chi022",
        username: "chi022",
        email: "chi022@live.com",
      },
      {
        id: "6h7i8j9k0b1c2d3e4f5g",
        name: "Psi023",
        username: "psi023",
        email: "psi023@icloud.com",
      },
      {
        id: "7i8j9k0b1c2d3e4f5g6h",
        name: "Omega024",
        username: "omega024",
        email: "omega024@protonmail.com",
      },
      {
        id: "8j9k0b1c2d3e4f5g6h7i",
        name: "Zeno025",
        username: "zeno025",
        email: "zeno025@zoho.com",
      },
      {
        id: "9k0b1c2d3e4f5g6h7i8j",
        name: "Hero026",
        username: "hero026",
        email: "hero026@gmx.com",
      },
      {
        id: "0b1c2d3e4f5g6h7i8j9k",
        name: "Zero027",
        username: "zero027",
        email: "zero027@yandex.com",
      },
      {
        id: "1d2e3f4g5h6i7j8k9b0c",
        name: "Alpha028",
        username: "alpha028",
        email: "alpha028@me.com",
      },
      {
        id: "2e3f4g5h6i7j8k9b0c1d",
        name: "Bravo029",
        username: "bravo029",
        email: "bravo029@hushmail.com",
      },
      {
        id: "3f4g5h6i7j8k9b0c1d2e",
        name: "Charlie030",
        username: "charlie030",
        email: "charlie030@fastmail.com",
      },
      {
        id: "4g5h6i7j8k9b0c1d2e3f",
        name: "Delta031",
        username: "delta031",
        email: "delta031@mailinator.com",
      },
      {
        id: "5h6i7j8k9b0c1d2e3f4g",
        name: "Echo032",
        username: "echo032",
        email: "echo032@aol.com",
      },
      {
        id: "6i7j8k9b0c1d2e3f4g5h",
        name: "Foxtrot033",
        username: "foxtrot033",
        email: "foxtrot033@yahoo.com",
      },
      {
        id: "7j8k9b0c1d2e3f4g5h6i",
        name: "Golf034",
        username: "golf034",
        email: "golf034@gmail.com",
      },
      {
        id: "8k9b0c1d2e3f4g5h6i7j",
        name: "Hotel035",
        username: "hotel035",
        email: "hotel035@outlook.com",
      },
      {
        id: "9b0c1d2e3f4g5h6i7j8k",
        name: "India036",
        username: "india036",
        email: "india036@hotmail.com",
      },
      {
        id: "0c1d2e3f4g5h6i7j8k9b",
        name: "Juliett037",
        username: "juliett037",
        email: "juliett037@mail.com",
      },
      {
        id: "1e2f3g4h5i6j7k8b9c0d",
        name: "Kilo038",
        username: "kilo038",
        email: "kilo038@example.com",
      },
      {
        id: "2f3g4h5i6j7k8b9c0d1e",
        name: "Lima039",
        username: "lima039",
        email: "lima039@live.com",
      },
      {
        id: "3g4h5i6j7k8b9c0d1e2f",
        name: "Mike040",
        username: "mike040",
        email: "mike040@icloud.com",
      },
      {
        id: "4h5i6j7k8b9c0d1e2f3g",
        name: "November041",
        username: "november041",
        email: "november041@protonmail.com",
      },
      {
        id: "5i6j7k8b9c0d1e2f3g4h",
        name: "Oscar042",
        username: "oscar042",
        email: "oscar042@zoho.com",
      },
      {
        id: "6j7k8b9c0d1e2f3g4h5i",
        name: "Papa043",
        username: "papa043",
        email: "papa043@gmx.com",
      },
      {
        id: "7k8b9c0d1e2f3g4h5i6j",
        name: "Quebec044",
        username: "quebec044",
        email: "quebec044@yandex.com",
      },
      {
        id: "8b9c0d1e2f3g4h5i6j7k",
        name: "Romeo045",
        username: "romeo045",
        email: "romeo045@me.com",
      },
      {
        id: "9c0d1e2f3g4h5i6j7k8b",
        name: "Sierra046",
        username: "sierra046",
        email: "sierra046@hushmail.com",
      },
      {
        id: "0d1e2f3g4h5i6j7k8b9c",
        name: "Tango047",
        username: "tango047",
        email: "tango047@fastmail.com",
      },
      {
        id: "1f2g3h4i5j6k7b8c9d0e",
        name: "Uniform048",
        username: "uniform048",
        email: "uniform048@mailinator.com",
      },
      {
        id: "2g3h4i5j6k7b8c9d0e1f",
        name: "Victor049",
        username: "victor049",
        email: "victor049@example.com",
      },
      {
        id: "3h4i5j6k7b8c9d0e1f2g",
        name: "Whiskey050",
        username: "whiskey050",
        email: "whiskey050@example.com",
      },
    ],
    defaultPage: 0,
  },
};
