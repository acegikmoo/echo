import { db } from "./index";
import { projects } from "./schema";

async function seed() {
  const [project] = await db
    .insert(projects)
    .values({
      name: "Test Project",
      userId: "test-user",
    })
    .returning();

  console.log("Created project:", project);
  console.log("Project ID:", project?.id);
  process.exit(0);
}

await seed();
