import KaryawanTable from "@/Components/KaryawanTable";
import MasterLayout from "../Layouts/MasterLayout";
import { usePage } from "@inertiajs/react";


export default function Personality() {
    const { roles = [], karyawan = [] } = usePage().props;

    return (
        <MasterLayout>
            <div className="px-6 pt-4">


                {/* Table karyawan */}
                <KaryawanTable karyawan={karyawan} roles={roles} />

            </div>
        </MasterLayout>
    );
}
