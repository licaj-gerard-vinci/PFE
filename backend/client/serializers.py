from rest_framework import serializers
from .models import Client, Template

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    templates = TemplateSerializer(many=True, read_only=True)
    id_templates = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Template.objects.all(),
        write_only=True
    )

    class Meta:
        model = Client
        fields = '__all__'

    def update(self, instance, validated_data):
        template_data = validated_data.pop('id_templates', None)
        if template_data is not None:
            instance.templates.set(template_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance