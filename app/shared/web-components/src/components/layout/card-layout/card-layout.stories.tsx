import { CardLayoutComponent } from "./card-layout.component";

export default {
  title: "Components/Layout/CardLayout",
  component: CardLayoutComponent,
};

export const Primary = {
  args: {
    children: <div>test</div>,
    label: "label",
    actions: "actions",
    centered: true,
  },
};

export const NotCentered = {
  args: {
    children: <div>test</div>,
    label: "label",
    actions: "actions",
    maw: "30rem",
    centered: false,
  },
};

export const Long = {
  args: {
    children: (
      <div>
        <div>Line 1</div>
        <div>Line 2</div>
        <div>Line 3</div>
        <div>Line 4</div>
        <div>Line 5</div>
        <div>Line 6</div>
        <div>Line 7</div>
        <div>Line 8</div>
        <div>Line 9</div>
        <div>Line 10</div>
        <div>Line 11</div>
        <div>Line 12</div>
        <div>Line 13</div>
        <div>Line 14</div>
        <div>Line 15</div>
        <div>Line 16</div>
        <div>Line 17</div>
        <div>Line 18</div>
        <div>Line 19</div>
        <div>Line 20</div>
        <div>Line 21</div>
        <div>Line 22</div>
        <div>Line 23</div>
        <div>Line 24</div>
      </div>
    ),
    actions: "Links",
  },
};

export const Wide = {
  args: {
    children: (
      <div style={{ whiteSpace: "nowrap" }}>
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      </div>
    ),
    actions: "Links",
  },
};

export const InnerCentering = {
  args: {
    mih: "60rem",
    label: (
      <>
        <div style={{ marginBottom: "2rem" }}>Top</div>
        <div>Center</div>
        <div style={{ marginTop: "2rem" }}>Bottom</div>
      </>
    ),
    children: (
      <>
        <div style={{ marginBottom: "auto" }}>Top</div>
        <div>Center</div>
        <div style={{ marginTop: "auto" }}>Bottom</div>
      </>
    ),
    actions: (
      <>
        <div style={{ marginBottom: "2rem" }}>Top</div>
        <div>Center</div>
        <div style={{ marginTop: "2rem" }}>Bottom</div>
      </>
    ),
  },
};
