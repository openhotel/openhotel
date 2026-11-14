import { MainLayoutComponent } from "./main-layout.component";
import {
  AccountItemComponent,
  ButtonComponent,
  HomeIconComponent,
  HotelIconComponent,
  NavItemComponent,
} from "../../../components";

export default {
  title: "Components/Layout/MainLayout",
  component: MainLayoutComponent,
};

export const MainLayout = {
  args: {
    headerChildren: (
      <>
        <ButtonComponent
          style={{ marginLeft: "2rem" }}
          variant="3d"
          color="yellow"
        >
          <span>Check In</span>
        </ButtonComponent>
        <AccountItemComponent username="pagoru" />
      </>
    ),
    navigatorChildren: (
      <>
        <NavItemComponent selected icon={<HomeIconComponent />}>
          Home
        </NavItemComponent>
        <NavItemComponent icon={<HotelIconComponent />}>
          Hotels
        </NavItemComponent>
        <NavItemComponent icon={<HotelIconComponent />}>
          Hotels
        </NavItemComponent>
        <NavItemComponent icon={<HotelIconComponent />}>
          Hotels or not hotels
        </NavItemComponent>
      </>
    ),
    children: (
      <>
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>
          content1111111111111111111111111111111111111 1 1111kj hn1kjh1jkh
          kjh1jkh 1hjk 1khj 1kjh1 hkj 1khjkh1j khj 1 sdf ;lkmjds fpkjlosdjklf
          jklsdfjkl sdjklf jksldfj klsdfjklsdjlkf
        </div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
      </>
    ),
    footerChildren: (
      <>
        <a href="#">Manifest</a>
        <a href="#">Report a bug</a>
        <a href="#">Run your own hotel</a>
        <a href="#">Terms and conditions</a>
      </>
    ),
  },
};

export const MainLayoutHeadless = {
  args: {
    navigatorChildren: (
      <>
        <NavItemComponent selected icon={<HomeIconComponent />}>
          Home
        </NavItemComponent>
        <NavItemComponent icon={<HotelIconComponent />}>
          Hotels
        </NavItemComponent>
        <NavItemComponent icon={<HotelIconComponent />}>
          Hotels
        </NavItemComponent>
        <NavItemComponent icon={<HotelIconComponent />}>
          Hotels or not hotels
        </NavItemComponent>
      </>
    ),
    children: (
      <>
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>
          content1111111111111111111111111111111111111 1 1111kj hn1kjh1jkh
          kjh1jkh 1hjk 1khj 1kjh1 hkj 1khjkh1j khj 1 sdf ;lkmjds fpkjlosdjklf
          jklsdfjkl sdjklf jksldfj klsdfjklsdjlkf
        </div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
        <div>content</div>
        <br />
      </>
    ),
    footerChildren: (
      <>
        <a href="#">Manifest</a>
        <a href="#">Report a bug</a>
        <a href="#">Run your own hotel</a>
        <a href="#">Terms and conditions</a>
      </>
    ),
  },
};
