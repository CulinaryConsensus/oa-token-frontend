import { Tabs as ApeTabs } from "@/components/Tabs/Tabs";
import { ApeCategory } from "@/utils/consts";

function Page() {
  return (
    <div className="relative mx-auto flex h-[40rem] w-full flex-col items-center  justify-start gap-8 px-5 pt-8 [perspective:1000px] md:h-[40rem]">
      <ApeTabs
        tabs={[
          {
            title: "Dreamer",
            value: "1",
            category: ApeCategory.Dreamer,
          },
          {
            title: "Explorer",
            value: "2",
            category: ApeCategory.Explorer,
          },
          {
            title: "Resident",
            value: "3",
            category: ApeCategory.Resident,
          },
          {
            title: "Elder",
            value: "4",
            category: ApeCategory.Elder,
          },
        ]}
      />
    </div>
  );
}

export default Page;
