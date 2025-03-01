import { fetchModels } from "@/app/actions/model-actions";
import ModelsList from "@/components/models/ModelsList";

const Models = async () => {
  const data = await fetchModels();
  console.log(data);
  return (
    <section className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Models</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your trained models
        </p>
      </div>
      <ModelsList models={data} />
    </section>
  );
};
export default Models;
