import { Accordion } from "@/components/accordion"
import { StatisticalTest } from "@/components/statistical-test"

export default function TestsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistical Tests</h2>

      <div className="space-y-4">
        <Accordion title="T-Test" defaultOpen>
          <StatisticalTest type="t-test" datasetId={params.id} description="Compare means between two groups." />
        </Accordion>

        <Accordion title="ANOVA">
          <StatisticalTest type="anova" datasetId={params.id} description="Compare means across multiple groups." />
        </Accordion>

        <Accordion title="Chi-Square Test">
          <StatisticalTest
            type="chi-square"
            datasetId={params.id}
            description="Test independence between categorical variables."
          />
        </Accordion>

        <Accordion title="Mann-Whitney U Test">
          <StatisticalTest
            type="mann-whitney"
            datasetId={params.id}
            description="Non-parametric test for comparing two independent samples."
          />
        </Accordion>
      </div>
    </div>
  )
}
